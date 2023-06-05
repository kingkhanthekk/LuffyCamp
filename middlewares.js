module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnPath = req.originalUrl;
    req.flash("error", "You must sign in first!");
    return res.redirect("/login");
  }
  next();
};
