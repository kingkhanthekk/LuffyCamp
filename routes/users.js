const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchError = require("../utils/catchError");
const passport = require("passport");

router.use(express.urlencoded({ extended: true }));

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.get("/login", (req, res) => {
  const redirectPath = req.session.returnPath || "/campgrounds";
  res.render("users/login", { redirectPath });
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (!err) {
      req.flash("success", "Successfully logged out!");
      res.redirect("/login");
    }
  });
});

router.post(
  "/register",
  catchError(async (req, res) => {
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
  })
);

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const { redirectPath } = req.body;
    console.log(req.session);
    req.flash("success", "Welcome back!");
    res.redirect(redirectPath);
  }
);

module.exports = router;
