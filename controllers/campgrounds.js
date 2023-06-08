const { cloudinary } = require("../cloudinary");
const Campground = require("../models/campground");
const mbxGeocode = require("@mapbox/mapbox-sdk/services/geocoding");

const geocoder = mbxGeocode({ accessToken: process.env.MAPBOX_TOKEN });

module.exports.index = async (req, res) => {
  const camps = await Campground.find({});
  res.render("camps/index", { camps });
};

module.exports.details = async (req, res) => {
  try {
    const camp = await Campground.findById(req.params.id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("author");
    res.render("camps/details", { camp });
  } catch {
    req.flash("error", "Cannot find the campground!");
    res.redirect("/campgrounds");
  }
};

module.exports.newForm = (req, res) => {
  res.render("camps/new");
};

module.exports.updateForm = async (req, res) => {
  try {
    const camp = await Campground.findById(req.params.id);
    res.render("camps/update", { camp });
  } catch {
    req.flash("error", "Cannot find the campground!");
    res.redirect("/campgrounds");
  }
};

module.exports.createCampground = async (req, res) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  const camp = new Campground(req.body.campground);
  camp.author = req.user._id;
  camp.geometry = geoData.body.features[0].geometry;
  camp.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  await camp.save();
  req.flash("success", "Successfully added a campground!");
  res.redirect(`/campgrounds/${camp._id}/details`);
};

module.exports.updateCampground = async (req, res) => {
  const delImages = req.body.deleteImages;
  const camp = await Campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground
  );
  const images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  camp.images.push(...images);
  await camp.save();
  if (delImages) {
    for (let filename of delImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await Campground.updateOne({
      $pull: { images: { filename: { $in: delImages } } },
    });
  }
  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${req.params.id}/details`);
};

module.exports.deleteCampground = async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash("success", "Successfully deleted campground!");
  res.redirect("/campgrounds");
};
