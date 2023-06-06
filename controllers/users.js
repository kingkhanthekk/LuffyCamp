const User = require("../models/user");

module.exports.registerForm = (req, res) => {
  res.render("users/register");
};

module.exports.loginForm = (req, res) => {
  const redirectPath = req.session.returnPath || "/campgrounds";
  res.render("users/login", { redirectPath });
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (!err) {
      req.flash("success", "Successfully logged out!");
      res.redirect("/login");
    }
  });
};

module.exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await new User({ username, email });
    const newUser = await User.register(user, password);
    req.login(newUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to LuffyCamp!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.login = (req, res) => {
  const { redirectPath } = req.body;
  req.flash("success", "Welcome back!");
  res.redirect(redirectPath);
};
