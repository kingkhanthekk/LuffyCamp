const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchError = require("../utils/catchError");
const passport = require("passport");
const usersController = require("../controllers/users");

router.use(express.urlencoded({ extended: true }));

router.get("/register", usersController.registerForm);

router.get("/login", usersController.loginForm);

router.get("/logout", usersController.logout);

router.post("/register", catchError(usersController.createUser));

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  usersController.login
);

module.exports = router;
