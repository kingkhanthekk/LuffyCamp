const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchError = require("../utils/catchError");

router.use(express.urlencoded({ extended: true }));

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchError(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const user = await new User({ username, email });
      await User.register(user, password);
      req.flash("success", "Welcome to LuffyCamp!");
      res.redirect("/campgrounds");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

module.exports = router;
