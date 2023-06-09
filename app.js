const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const AppError = require("./utils/AppError");
const app = express();
const passport = require("passport");
const passportLocal = require("passport-local");
const User = require("./models/user");

//Requiring routes
const camgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

//Initializing ejs
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//Initializing boilerplate
app.engine("ejs", ejsMate);

//Initializing post method, method override, and static
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

//Initializing session and flash
const sessionConfig = {
  secret: "thisisasecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 3600 * 3,
    maxAge: 1000 * 3600 * 3,
  },
};

app.use(session(sessionConfig));
app.use(flash());

// passport initialization
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));

//passport serialize and deserialize
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentRoute = req.originalUrl;
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//Route initialization
app.use("/campgrounds", camgroundRoutes);
app.use("/campgrounds/:id/review", reviewRoutes);
app.use("/", userRoutes);

//MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/campDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected");
  })
  .catch((e) => {
    console.log("Connection error ", e);
  });

app.get("/", (req, res) => {
  res.render("camps/home");
});

app.all("*", (req, res, next) => {
  return next(new AppError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.status) err.status = 500;
  if (!err.message) err.message = "Oh No! Something went wrong.";
  res.status(status).render("camps/error", { err });
});

app.listen(3000, () => {
  console.log("Server running on port 3000.");
});
