// Accountlist
const Mongoose = require("mongoose");

const AuthorListSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  authorURLKey: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  isEnabled: {
    type: Boolean,
  },
});

module.exports = Mongoose.model("Author", AuthorListSchema);
