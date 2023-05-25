const express = require("express");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const path = require("path");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

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
  res.render("home");
});

app.get("/campgrounds", async (req, res) => {
  const camps = await Campground.find({});
  res.render("index", { camps });
});

app.get("/campgrounds/:id/details", async (req, res) => {
  const camp = await Campground.findById(req.params.id);
  res.render("details", { camp });
});

app.listen(3000, () => {
  console.log("Server running on port 3000.");
});
