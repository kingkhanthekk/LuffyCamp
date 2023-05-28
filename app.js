const express = require("express");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchError = require("./utils/catchError");
const AppError = require("./utils/AppError");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

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

app.get(
  "/campgrounds",
  catchError(async (req, res) => {
    const camps = await Campground.find({});
    res.render("camps/index", { camps });
  })
);

app.get(
  "/campgrounds/:id/details",
  catchError(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    res.render("camps/details", { camp });
  })
);

app.get("/campgrounds/new", (req, res) => {
  res.render("camps/new");
});

app.get(
  "/campgrounds/:id/update",
  catchError(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    res.render("camps/update", { camp });
  })
);

app.post(
  "/campgrounds",
  catchError(async (req, res, next) => {
    if (!req.body) {
      return next(new AppError("Fields cannot be empty", 400));
    }
    const camp = new Campground(req.body);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}/details`);
  })
);

app.put(
  "/campgrounds/:id",
  catchError(async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/campgrounds/${req.params.id}/details`);
  })
);

app.delete(
  "/campgrounds/:id",
  catchError(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
  })
);

app.all("*", (req, res, next) => {
  return next(new AppError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { message = "Something went wrong", status = 500 } = err;
  res.status(status).send(message);
});

app.listen(3000, () => {
  console.log("Server running on port 3000.");
});
