const mongoose = require("mongoose");
const Campground = require("../models/campground");
const seeds = require("./seeds");
const { descriptors, places } = require("./seedHelpers");

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

const name = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    let price = Math.floor(Math.random() * 20) + 10;
    let camp = new Campground({
      title: `${name(descriptors)} ${name(places)}`,
      location: `${seeds[i].city}, ${seeds[i].state}`,
      image: "https://source.unsplash.com/random/?campground",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro rerum ipsa facilis nesciunt alias praesentium recusandae impedit quis necessitatibus explicabo. Fugit sed natus autem officiis officia, facilis doloribus. Neque, error?",
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
