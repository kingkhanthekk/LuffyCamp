if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

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
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const MongoStore = require("connect-mongo");

//Requiring routes
const camgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

// const DB = process.env.DB_URL;
const DB = process.env.DB_URL || "mongodb://127.0.0.1:27017/campDB";

//MongoDB connection
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected");
  })
  .catch((e) => {
    console.log("Connection error ", e);
  });

//Initializing ejs
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//Initializing boilerplate
app.engine("ejs", ejsMate);

//Initializing post method, method override, and static
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

//Mongo injection sanitize
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

//Initialize mongo store for sessions
const secret = process.env.SECRET || "thisisasecret";
const store = MongoStore.create({
  mongoUrl: DB,
  crypto: {
    secret,
  },
  touchAfter: 3600 * 24,
});

//Initializing session and flash
const sessionConfig = {
  store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 3600 * 3,
    maxAge: 1000 * 3600 * 3,
  },
};

app.use(session(sessionConfig));
app.use(flash());

//Initialize helmet
app.use(helmet());

//Helmet content security policy
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net/",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dxql5gfer/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        "https://images.unsplash.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
