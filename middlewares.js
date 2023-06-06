const AppError = require("./utils/AppError");
const { campSchema, reviewSchema } = require("./validationSchemas");
const Campground = require("./models/campground");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnPath = req.originalUrl;
    req.flash("error", "You must sign in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.validateCamp = (req, res, next) => {
  const { error } = campSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((i) => i.message).join(",");
    next(new AppError(msg, 400));
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const camp = await Campground.findById(id);
  if (!camp.author.equals(req.user._id)) {
    req.flash("error", "You are not allowed to do that!");
    return res.redirect(`/campgrounds/${id}/details`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((i) => i.message).join(",");
    next(new AppError(msg, 400));
  } else {
    next();
  }
};
