if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const router = express.Router();
const catchError = require("../utils/catchError");
const methodOverride = require("method-override");
const { isLoggedIn, validateCamp, isAuthor } = require("../middlewares");
const campgroundsController = require("../controllers/campgrounds");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.use(methodOverride("_method"));
router.use(express.urlencoded({ extended: true }));

//Adding controllers

router
  .route("/")
  .get(catchError(campgroundsController.index))
  .post(upload.single("image"), (req, res) => {
    console.log(req.body, req.file);
  });
// .post(
//   isLoggedIn,
//   validateCamp,
//   catchError(campgroundsController.createCampground)
// );

router.get("/:id/details", catchError(campgroundsController.details));

router.get("/new", isLoggedIn, campgroundsController.newForm);

router.get(
  "/:id/update",
  isLoggedIn,
  isAuthor,
  catchError(campgroundsController.updateForm)
);

router
  .route("/:id")
  .put(
    isLoggedIn,
    isAuthor,
    validateCamp,
    catchError(campgroundsController.updateCampground)
  )
  .delete(
    isLoggedIn,
    isAuthor,
    catchError(campgroundsController.deleteCampground)
  );

module.exports = router;
