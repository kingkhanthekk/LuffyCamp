const Campground = require("../models/campground");

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
  const camp = new Campground(req.body.campground);
  camp.author = req.user._id;
  await camp.save();
  req.flash("success", "Successfully added a campground!");
  res.redirect(`/campgrounds/${camp._id}/details`);
};

module.exports.updateCampground = async (req, res) => {
  await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${req.params.id}/details`);
};

module.exports.deleteCampground = async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash("success", "Successfully deleted campground!");
  res.redirect("/campgrounds");
};
