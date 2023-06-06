const express = require("express");
const router = express.Router();
const catchError = require("../utils/catchError");
const methodOverride = require("method-override");
const { isLoggedIn, validateCamp, isAuthor } = require("../middlewares");
const campgroundsController = require("../controllers/campgrounds");

router.use(methodOverride("_method"));
router.use(express.urlencoded({ extended: true }));

//Adding controllers

router.get("/", catchError(campgroundsController.index));

router.get("/:id/details", catchError(campgroundsController.details));

router.get("/new", isLoggedIn, campgroundsController.newForm);

router.get(
  "/:id/update",
  isLoggedIn,
  isAuthor,
  catchError(campgroundsController.updateForm)
);

router.post(
  "/",
  isLoggedIn,
  validateCamp,
  catchError(campgroundsController.createCampground)
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCamp,
  catchError(campgroundsController.updateCampground)
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchError(campgroundsController.deleteCampground)
);

module.exports = router;
