const { Schema, model } = require("mongoose");

const GroupSchema = Schema({
  created: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
  },
  moderator: { type: Schema.Types.ObjectId, ref: "User" },
  name: {
    type: String,
    trim: true,
    required: "Name of group is required",
  },
  description: {
    type: String,
    required: "Description of group is required",
  },
  interests: [{ type: Schema.Types.ObjectId, ref: "Interest" }],
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
});

module.exports = model("Group", GroupSchema);
