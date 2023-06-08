const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const { cloudinary } = require("../cloudinary");

const imageSchema = Schema({
  url: String,
  filename: String,
});

imageSchema.virtual("thumbnail").get(function () {
  return (this.url = cloudinary.url(this.filename, {
    width: 200,
    height: 150,
    crop: "fill",
  }));
});

imageSchema.virtual("detail").get(function () {
  return (this.url = cloudinary.url(this.filename, {
    width: 500,
    height: 350,
    crop: "fill",
  }));
});

const campgroundSchema = new Schema({
  title: String,
  price: Number,
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  images: [imageSchema],
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

campgroundSchema.post("findOneAndDelete", async (camp) => {
  if (camp) {
    await Review.deleteMany({ _id: { $in: camp.reviews } });
  }
});

module.exports = mongoose.model("Campground", campgroundSchema);
