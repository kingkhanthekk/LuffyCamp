const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchError = require("../utils/catchError");
const passport = require("passport");
const usersController = require("../controllers/users");

router.use(express.urlencoded({ extended: true }));

router
  .route("/register")
  .get(usersController.registerForm)
  .post(catchError(usersController.createUser));

router
  .route("/login")
  .get(usersController.loginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    usersController.login
  );

router.get("/logout", usersController.logout);

module.exports = router;
