const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    bgColor: {
      type: String,
      default: "#5b45b0",
    },
    icon: {
      type: String,
      default: "🍽️",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
