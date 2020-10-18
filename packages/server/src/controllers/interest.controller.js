const { Interest, User } = require("../models");

async function allInterests(_, res) {
  try {
    const interests = await Interest.find();
    res.status(200).json(interests);
  } catch (error) {
    console.error(error.message || error);
    res.status(400).json({ message: "Failed to retrieve interests", error });
  }
}

async function createInterest(req, res) {
  try {
    const interest = new Interest(req.body);
    const newInterest = await interest.save();

    for (const userId of interest.users) {
      const user = await User.findById(userId);
      user.interests.push(interest._id);
      user.lastUpdated = new Date();
      user.save();
    }

    res.status(200).json(newInterest);
  } catch (error) {
    console.error(error.message || error);
    const { code, keyValue } = error;
    if (code === 10000 || (code === 11000 && keyValue.name)) {
      res.status(401).json({
        message: "An interest with that name already exists",
        error,
      });
    } else {
      res.status(500).json({ message: "Failed to create interest", error });
    }
  }
}

async function readInterest(req, res) {
  try {
    const { id } = req.params;
    const interest = await Interest.findById(id);
    res.status(200).json(interest);
  } catch (error) {
    console.error(error.message || error);
    res.status(500).json({ message: "Failed to retrieve interest", error });
  }
}

async function updateInterest(req, res) {
  try {
    const { id } = req.params;
    const { users, appendedUser, removedUser } = req.body;
    const interest = await Interest.findById(id);

    if (users) {
      interest.users = users;
    } else if (appendedUser) {
      interest.appendedUser = appendedUser;
    } else if (removedUser) {
      interest.removedUser = removedUser;
    }

    const updatedInterest = await interest.save();
    console.log(updatedInterest);
    res.status(200).json(updatedInterest);
  } catch (error) {
    console.error(error.message || error);
    res.status(500).json({ message: "Failed to update interest", error });
  }
}

async function deleteInterest(req, res) {
  try {
    const { id } = req.params;
    const interest = await Interest.findById(id);
    const deletedInterest = await interest.remove();
    res.status(200).json(deletedInterest);
  } catch (error) {
    console.error(error.message || error);
    res.status(500).json({ message: "Failed to delete interest", error });
  }
}

module.exports = {
  allInterests,
  createInterest,
  readInterest,
  updateInterest,
  deleteInterest,
};
