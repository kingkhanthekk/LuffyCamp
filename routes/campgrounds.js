const express = require("express");
const router = express.Router();
const catchError = require("../utils/catchError");
const Campground = require("../models/campground");
const AppError = require("../utils/AppError");
const { campSchema } = require("../validationSchemas");
const methodOverride = require("method-override");

router.use(methodOverride("_method"));
router.use(express.urlencoded({ extended: true }));

const validateCamp = (req, res, next) => {
  const { error } = campSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((i) => i.message).join(",");
    next(new AppError(msg, 400));
  } else {
    next();
  }
};

router.get(
  "/",
  catchError(async (req, res) => {
    const camps = await Campground.find({});
    res.render("camps/index", { camps });
  })
);

router.get(
  "/:id/details",
  catchError(async (req, res) => {
    const camp = await Campground.findById(req.params.id).populate("reviews");
    res.render("camps/details", { camp });
  })
);

router.get("/new", (req, res) => {
  res.render("camps/new");
});

router.get(
  "/:id/update",
  catchError(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    res.render("camps/update", { camp });
  })
);

router.post(
  "/",
  validateCamp,
  catchError(async (req, res) => {
    const camp = new Campground(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}/details`);
  })
);

router.put(
  "/:id",
  validateCamp,
  catchError(async (req, res) => {
    console.dir(req.body);
    await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    res.redirect(`/campgrounds/${req.params.id}/details`);
  })
);

router.delete(
  "/:id",
  catchError(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
  })
);

module.exports = router;
