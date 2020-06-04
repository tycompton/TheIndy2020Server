const mongoose = require("mongoose");

const brewerySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 100,
      unique: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Brewery", brewerySchema);
