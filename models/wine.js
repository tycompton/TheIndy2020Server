const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const wineSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 32
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  price: {
    type: Number,
    required: true,
  },
  type: {
    type: ObjectId,
    ref: 'Type',
    required: true 
  },
  producer: {
    type: ObjectId,
    ref: 'Producer',
    required: true
  },
  quantity: {
    type: Number,
  },
  sold:{
    type: Number,
    default: 0
  },
  image: {
    data: Buffer,
    contentType: String
  },
  delivery: {
    required: false,
    type: Boolean  
  },
  publish: {
    required: false,
    type: Boolean 
  },
  available: {
    required: false,
    type: Boolean 
  },
  size: {
    required: false,
    type: Number 
  }
}, 
{ timestamps: true }
);

module.exports = mongoose.model("Wine", wineSchema);  