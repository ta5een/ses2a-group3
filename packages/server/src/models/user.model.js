const { Schema, model } = require("mongoose");
const crypto = require("crypto");

const UserSchema = Schema({
  created: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    trim: true,
    required: "Name is required",
  },
  email: {
    type: String,
    trim: true,
    unique: "Email already exists",
    required: "Email is required",
    validate: function (newEmail) {
      const regex = /^[A-Z0-9._%+-]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/g;
      return regex.test(newEmail.toUpperCase());
    },
  },
  hashedPassword: {
    type: String,
    required: "Password is required",
  },
  salt: {
    type: String,
  },
  about: {
    type: String,
    trim: true,
  },
});

UserSchema.virtual("plainTextPassword").set(function (newPassword) {
  this.salt = this.makeSalt();
  this.hashedPassword = this.encryptPassword(newPassword);
});

UserSchema.methods = {
  authenticate: function (plainTextPassword) {
    return this.hashedPassword === this.encryptPassword(plainTextPassword);
  },

  makeSalt: function () {
    return `${Math.round(new Date().valueOf() * Math.random())}`;
  },

  encryptPassword: function (newPassword) {
    if (!newPassword) {
      return "";
    }

    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(newPassword)
        .digest("hex");
    } catch (error) {
      return "";
    }
  },
};

module.exports = model("User", UserSchema);
