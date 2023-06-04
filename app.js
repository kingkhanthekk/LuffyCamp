const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const AppError = require("./utils/AppError");
const camgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use("/campgrounds", camgroundRoutes);
app.use("/campgrounds/:id/review", reviewRoutes);

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
