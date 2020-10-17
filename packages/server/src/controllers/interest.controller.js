const { Interest, User } = require("../models");

async function allInterests(_, res) {
  try {
    const interests = await Interest.find();
    res.status(200).json(interests);
  } catch (error) {
    console.error(error);
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
    console.error(error);
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
    const { _id, name, users } = await Interest.findById(id);
    res.status(200).json({ _id, name, users });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to get interest with given ID", error });
  }
}

async function updateInterest(req, res) {
  try {
    const { id } = req.params;
    const { users, appendedUser } = req.body;
    const interest = await Interest.findById(id);

    if (users) {
      interest.users = users;
    } else if (interest.users.indexOf(appendedUser) === -1) {
      interest.users.push(appendedUser);
    }

    const updatedInterest = await interest.save();

    res.status(200).json(updatedInterest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update interest", error });
  }
}

async function deleteInterest(req, res) {
  try {
    const interest = await Interest.findById(req.params.id);
    const deletedInterest = await interest.remove();
    res.status(200).json(deletedInterest);
  } catch (error) {
    console.error(error);
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
