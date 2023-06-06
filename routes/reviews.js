const express = require("express");
const router = express.Router({ mergeParams: true });
const catchError = require("../utils/catchError");
const Campground = require("../models/campground");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middlewares");
const Review = require("../models/review");
const methodOverride = require("method-override");

router.use(methodOverride("_method"));
router.use(express.urlencoded({ extended: true }));

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchError(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camp.reviews.push(review);
    await camp.save();
    await review.save();
    req.flash("success", "Successfully added a review!");
    res.redirect(`/campgrounds/${camp._id}/details`);
  })
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchError(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review!");
    res.redirect(`/campgrounds/${id}/details`);
  })
);

module.exports = router;
