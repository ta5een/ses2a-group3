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

async function createGroup(req, res) {
  try {
    const group = new Group(req.body);
    const newGroup = await group.save();

    // const { interests } = req.body;
    // for (const interestId of interests) {
    //   const interest = await Interest.findById(interestId);
    //   if (interest) {
    //     interest.appendedGroup = [group._id];
    //     await interest.save();
    //   } else {
    //     res.status(400).json({
    //       message: `Failed to retrieve interest with ID: ${interestId}`,
    //     });
    //     return;
    //   }
    // }

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
    const deletedGroup = await group.remove();
    res.status(200).json(deletedGroup);
  } catch (error) {
    console.error(error.message || error);
    res.status(500).json({ message: "Failed to delete group", error });
  }
}

module.exports = {
  allGroups,
  createGroup,
  readGroup,
  updateGroup,
  deleteGroup,
};
