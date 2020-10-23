const { Group, Interest } = require("../models");

async function allGroups(_, res) {
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (error) {
    console.error(error.message || error);
    res.status(400).json({ message: "Failed to retrieve groups", error });
  }
}

async function allGroupsByModerator(_, res) {
  try {
    const { _id: userId } = req.user;
    const groups = await Group.find({ moderator: userId });
    res.status(200).json(groups);
  } catch (error) {
    console.error(error.message || error);
    res
      .status(400)
      .json({ message: "Failed to retrieve groups by moderator", error });
  }
}

async function groupWithId(req, res, next, id) {
  try {
    let group = await Group.findById(id).populate("moderator", ["_id", "name"]);
    if (!group) {
      res.status("400").json({ message: "Group not found" });
    } else {
      req.group = group;
      next();
    }
  } catch (error) {
    console.log(error.message || error);
    res.status(400).json({ message: "Failed to set group header", error });
  }
}

function isModerator(req, res, next) {
  const isModerator =
    req.group &&
    req.auth &&
    req.group.moderator._id.toString() === req.auth._id;

  if (!isModerator) {
    res.status(403).json({ message: "User is not a moderator" });
  }

  next();
}

async function createGroup(req, res) {
  try {
    const group = new Group(req.body);
    const newGroup = await group.save();

    const { interests } = req.body;
    for (const interestId of interests) {
      const interest = await Interest.findById(interestId);
      if (interest) {
        interest.appendedGroup = [group._id];
        await interest.save();
      } else {
        res.status(400).json({
          message: `Failed to retrieve interest with ID: ${interestId}`,
        });
        return;
      }
    }

    res.status(200).json(newGroup);
  } catch (error) {
    console.error(error.message || error);
    res.status(500).json({ message: "Failed to create group", error });
  }
}

async function readGroup(req, res) {
  try {
    const { id } = req.params;
    const group = await Group.findById(id);
    res.status(200).json(group);
  } catch (error) {
    console.error(error.message || error);
    res.status(500).json({ message: "Failed to retrieve group", error });
  }
}

async function updateGroup(req, res) {
  try {
    const { id } = req.params;
    const {
      /* params... */
    } = req.body;
    const group = await Group.findById(id);

    // Update group...

    const updatedGroup = await group.save();
    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error(error.message || error);
    res.status(500).json({ message: "Failed to update group", error });
  }
}

async function deleteGroup(req, res) {
  try {
    const { id } = req.params;
    const group = await Group.findById(id);
    if (!group) {
      res.status(404).json({ message: "Failed to delete group with given ID" });
    } else {
      const deletedGroup = await group.remove();
      res.status(200).json(deletedGroup);
    }
  } catch (error) {
    console.error(error.message || error);
    res.status(500).json({ message: "Failed to delete group", error });
  }
}

module.exports = {
  allGroups,
  allGroupsByModerator,
  groupWithId,
  isModerator,
  createGroup,
  readGroup,
  updateGroup,
  deleteGroup,
};
