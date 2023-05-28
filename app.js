const express = require("express");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchError = require("./utils/catchError");

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
  catchError(async (req, res) => {
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

app.use((err, req, res, next) => {
  res.send("Something went wrong.");
});

app.listen(3000, () => {
  console.log("Server running on port 3000.");
});
