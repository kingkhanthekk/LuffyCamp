const express = require("express");
const router = express.Router({ mergeParams: true });
const catchError = require("../utils/catchError");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middlewares");
const methodOverride = require("method-override");
const reviewsController = require("../controllers/reviews");

router.use(methodOverride("_method"));
router.use(express.urlencoded({ extended: true }));

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchError(reviewsController.createReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchError(reviewsController.deleteReview)
);

module.exports = router;
