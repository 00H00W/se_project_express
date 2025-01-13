const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "The name field is required."],
    minlength: 2,
    maxlength: 30,
  },
  weather: {
    type: String,
    required: [true, "The weather field is required."],
    enum: ["hot", "warm", "cold"],
  },

  imageUrl: {
    type: String,
    required: [true, "The avatar field is required."],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL.",
    },
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    // required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("clothingItem", clothingItemSchema);
