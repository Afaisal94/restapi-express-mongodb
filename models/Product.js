const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 255,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
