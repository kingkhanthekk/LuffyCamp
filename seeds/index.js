const mongoose = require("mongoose");
const Campground = require("../models/campground");
const seeds = require("./seeds");
const { descriptors, places } = require("./seedHelpers");
const mbxGeocode = require("@mapbox/mapbox-sdk/services/geocoding");

const geocoder = mbxGeocode({
  accessToken:
    "pk.eyJ1Ijoia2luZ2toYW50aGVrayIsImEiOiJjbGluMGgxa3AwcHlrM2twY3JudnA5NjlsIn0.6XnIR2jgo1yw-UeTbaeTWQ",
});

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
    const location = `${seeds[i].city}, ${seeds[i].state}`;
    const geoData = await geocoder
      .forwardGeocode({
        query: location,
        limit: 1,
      })
      .send();
    let camp = new Campground({
      author: "647dfacf1b3cbb6749f60092",
      title: `${name(descriptors)} ${name(places)}`,
      location,
      geometry: geoData.body.features[0].geometry,
      images: [
        {
          url: "https://res.cloudinary.com/dxql5gfer/image/upload/v1686153377/LuffyCamp/bfwileinjm4fmnrqx348.jpg",
          filename: "LuffyCamp/bfwileinjm4fmnrqx348",
        },
        {
          url: "https://res.cloudinary.com/dxql5gfer/image/upload/v1686153379/LuffyCamp/etyrd5dmxv8ajii3kmvd.jpg",
          filename: "LuffyCamp/etyrd5dmxv8ajii3kmvd",
        },
        {
          url: "https://res.cloudinary.com/dxql5gfer/image/upload/v1686153381/LuffyCamp/uozgc2rlarcb9wytxilh.jpg",
          filename: "LuffyCamp/uozgc2rlarcb9wytxilh",
        },
      ],
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
