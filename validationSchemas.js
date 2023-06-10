const BaseJoi = require("joi");
// const SanitizeHtml = require("sanitize-html");

function sanitizeHtml(input) {
  return input.replace(/(<([^>]+)>)/gi, "");
}

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    htmlStrip: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.campSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().htmlStrip().required(),
    location: Joi.string().htmlStrip().required(),
    // image: Joi.string().required(),
    price: Joi.number().required().min(0),
    description: Joi.string().htmlStrip().required(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    text: Joi.string().htmlStrip().required(),
    rating: Joi.number().required().min(1).max(5),
  }).required(),
});
