const { Schema, model } = require("mongoose");

const InterestSchema = Schema({
  name: {
    type: String,
    trim: true,
    unique: "An interest with that name already exists",
    required: "Name of interest is required",
  },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
});

InterestSchema.virtual("appendedUser").set(function (newUser) {
  this.users = [...this.users, newUser];
});

InterestSchema.virtual("removedUser").set(function (removedUser) {
  this.users = this.users.filter(userId => {
    return userId.toString() !== removedUser.toString();
  });
});

InterestSchema.virtual("appendedGroup").set(function (newGroup) {
  this.groups = [...this.groups, newGroup];
});

InterestSchema.virtual("removedGroup").set(function (removedGroup) {
  this.groups = this.groups.filter(groupId => {
    return groupId.toString() !== removedGroup.toString();
  });
});

module.exports = model("Interest", InterestSchema);
