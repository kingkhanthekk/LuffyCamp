const express = require("express");
const router = express.Router({ mergeParams: true });
const catchError = require("../utils/catchError");
const Campground = require("../models/campground");
const AppError = require("../utils/AppError");
const { reviewSchema } = require("../validationSchemas");
const Review = require("../models/review");
const methodOverride = require("method-override");

router.use(methodOverride("_method"));
router.use(express.urlencoded({ extended: true }));

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((i) => i.message).join(",");
    next(new AppError(msg, 400));
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  catchError(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await camp.save();
    await review.save();
    req.flash("success", "Successfully added a review!");
    res.redirect(`/campgrounds/${camp._id}/details`);
  })
);

router.delete(
  "/:reviewId",
  catchError(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review!");
    res.redirect(`/campgrounds/${id}/details`);
  })
);

module.exports = router;
