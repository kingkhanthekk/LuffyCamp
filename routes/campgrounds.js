const express = require("express");
const router = express.Router();
const catchError = require("../utils/catchError");
const Campground = require("../models/campground");
const AppError = require("../utils/AppError");
const { campSchema } = require("../validationSchemas");
const methodOverride = require("method-override");
const { isLoggedIn } = require("../middlewares");

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
    try {
      const camp = await Campground.findById(req.params.id).populate("reviews");
      res.render("camps/details", { camp });
    } catch {
      req.flash("error", "Cannot find the campground!");
      res.redirect("/campgrounds");
    }
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("camps/new");
});

router.get(
  "/:id/update",
  isLoggedIn,
  catchError(async (req, res) => {
    try {
      const camp = await Campground.findById(req.params.id);
      res.render("camps/update", { camp });
    } catch {
      req.flash("error", "Cannot find the campground!");
      res.redirect("/campgrounds");
    }
  })
);

router.post(
  "/",
  validateCamp,
  catchError(async (req, res) => {
    const camp = new Campground(req.body.campground);
    await camp.save();
    req.flash("success", "Successfully added a campground!");
    res.redirect(`/campgrounds/${camp._id}/details`);
  })
);

router.put(
  "/:id",
  isLoggedIn,
  validateCamp,
  catchError(async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    req.flash("success", "Successfully updated campground!");
    res.redirect(`/campgrounds/${req.params.id}/details`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  catchError(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash("success", "Successfully deleted campground!");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
