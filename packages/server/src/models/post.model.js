const { Schema, model } = require("mongoose");

const PostSchema = Schema({
  created: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
  },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  title: {
    type: String,
    required: "Title of post is required",
  },
  text: {
    type: String,
    required: "Text of post is required",
  },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      text: { type: String, required: "Text of comment is required" },
      created: { type: Date, default: Date.now },
      author: { type: Schema.Types.ObjectId, ref: "User" },
    },
  ],
});

module.exports = model("Post", PostSchema);
