const { User } = require("../models");

async function allUsers(_, res) {
  try {
    const users = await User.find().select([
      "admin",
      "name",
      "email",
      "created",
      "lastUpdated",
      "about",
      "interests",
    ]);
    res.status(200).json(users);
  } catch (error) {
    console.log(error.message || error);
    res.status(400).json({ message: "Failed to retrieve users", error });
  }
}

async function userWithId(req, res, next, id) {
  try {
    let user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      req.user = { _id: id, admin: user.admin };
      next();
    }
  } catch (error) {
    console.log(error.message || error);
    res.status(400).json({ message: "Failed to set user header", error });
  }
}

async function isAdmin(req, res, next) {
  try {
    console.log(req.user);
    const isAdmin = req.user && req.user.admin;
    if (isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "User is not an admin" });
    }
  } catch (error) {
    console.log(error.message || error);
    res.status(403).json({ message: "Failed to check if user is admin" });
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
    console.log(error.message || error);
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
    console.log(error.message || error);
    res
      .status(500)
      .json({ message: "Failed to get user with given ID", error });
  }
}

async function updateUser(req, res) {
  try {
    const id = req.user._id;
    const updatedValues = { ...req.body, lastUpdated: Date.now() };
    const updatedUser = await User.findByIdAndUpdate(id, updatedValues, {
      new: true,
      useFindAndModify: false,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error.message || error);
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
    console.log(error.message || error);
    res.status(500).json({ message: "Failed to delete user", error });
  }
}

module.exports = {
  allUsers,
  userWithId,
  isAdmin,
  createUser,
  readUser,
  updateUser,
  deleteUser,
};
