const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 255,
  },
});

module.exports = mongoose.model("Category", categorySchema);
