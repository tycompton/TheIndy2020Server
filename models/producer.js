const mongoose = require("mongoose");

const producerSchema = new mongoose.Schema(
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

module.exports = mongoose.model("Producer", producerSchema);
