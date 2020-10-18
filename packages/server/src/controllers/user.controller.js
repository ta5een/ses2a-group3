const { User } = require("../models");

async function allUsers(_, res) {
  try {
    const users = await User.find().select([
      "name",
      "email",
      "updated",
      "created",
      "interests",
    ]);
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: "Failed to retrieve users", error });
  }
}

async function userWithId(req, res, next, id) {
  try {
    req.user = { _id: id };
    next();
  } catch (error) {
    res.status(400).json({ message: "Failed to set header", error });
  }
}

async function createUser(req, res) {
  try {
    const user = new User(req.body);
    const newUser = await user.save();
    newUser.hashedPassword = undefined;
    newUser.salt = undefined;
    res.status(200).json(newUser);
  } catch (error) {
    const { code, keyValue } = error;
    if (code === 10000 || (code === 11000 && keyValue.email)) {
      res.status(401).json({
        message:
          "An account with the email you provided is already taken. Please use an alternative email address.",
        error,
      });
    } else {
      res.status(500).json({
        message:
          "There was an error creating your account. Please try again later.",
        error,
      });
    }
  }
}

async function readUser(req, res) {
  try {
    const user = await User.findById(req.user._id);
    user.hashedPassword = undefined;
    user.salt = undefined;
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get user with given ID", error });
  }
}

async function updateUser(req, res) {
  try {
    const user = await User.findById(req.user._id);
    const updatedUser = await user.updateOne(req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to update user", error });
  }
}

async function deleteUser(req, res) {
  try {
    const user = await User.findById(req.user._id);
    const deletedUser = await user.remove();
    deletedUser.hashed_password = undefined;
    deletedUser.salt = undefined;
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user", error });
  }
}

module.exports = {
  allUsers,
  userWithId,
  createUser,
  readUser,
  updateUser,
  deleteUser,
};
