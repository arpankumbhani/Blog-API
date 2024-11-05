// PostList
const Mongoose = require("mongoose");

const PostListSchema = new Mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  authorId: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  categoryId: {
    type: String,
    required: true,
  },
  postDescriptions: {
    type: String,
    required: true,
  },
  postURLKey: {
    type: String,
    required: true,
  },
  postImg: {
    type: String,
    required: true,
  },
  isEnabled: {
    type: Boolean,
  },
});

module.exports = Mongoose.model("Post", PostListSchema);
