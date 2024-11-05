// CategoryList
const Mongoose = require("mongoose");

const CategoryListSchema = new Mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    trim: true,
  },
  categoryURLKey: {
    type: String,
    required: true,
  },
  isEnabled: {
    type: Boolean,
  },
});

module.exports = Mongoose.model("Category", CategoryListSchema);
