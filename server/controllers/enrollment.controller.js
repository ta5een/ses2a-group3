import Enrollment from '../models/enrollment.model';
import errorHandler from '../helpers/dbErrorHandler';

const create = async (req, res) => {
  let newEnrollment = {
    group: req.group,
    member: req.auth
  };

  newEnrollment.contentStatus = req.group.contents.map((content) => {
    return { content: content, complete: false };
  });

  const enrollment = new Enrollment(newEnrollment);

  try {
    let result = await enrollment.save();
    return res.status(200).json(result);
  } catch (error) {
    console.error(`A server error occurred: ${error}`);
    return res.status(400).json({ error: errorHandler.getErrorMessage(error) });
  }
};

/**
 * Load enrollment and append to req.
 */
const enrollmentByID = async (req, res, next, id) => {
  try {
    let enrollment = await Enrollment.findById(id)
      .populate({ path: 'group', populate: { path: 'moderator' } })
      .populate('member', '_id name');

    if (!enrollment) {
      return res.status('400').json({ error: 'Enrollment not found' });
    }

    req.enrollment = enrollment;
    next();
  } catch (error) {
    console.error(`A server error occurred: ${error}`);
    return res.status('400').json({ error: 'Could not retrieve enrollment' });
  }
};

const read = (req, res) => {
  return res.json(req.enrollment);
};

const complete = async (req, res) => {
  let updatedData = {};
  updatedData['contentStatus.$.complete'] = req.body.complete;
  updatedData.updated = Date.now();

  if (req.body.groupCompleted) {
    updatedData.completed = req.body.groupCompleted;
  }

  try {
    let enrollment = await Enrollment.updateOne(
      { 'contentStatus._id': req.body.contentStatusId },
      { $set: updatedData }
    );
    res.json(enrollment);
  } catch (error) {
    console.error(`A server error occurred: ${error}`);
    return res.status(400).json({ error: errorHandler.getErrorMessage(error) });
  }
};

const remove = async (req, res) => {
  try {
    let enrollment = req.enrollment;
    let deletedEnrollment = await enrollment.remove();
    res.json(deletedEnrollment);
  } catch (error) {
    console.error(`A server error occurred: ${error}`);
    return res.status(400).json({ error: errorHandler.getErrorMessage(error) });
  }
};

const isMember = (req, res, next) => {
  const isMember = req.auth && req.auth._id == req.enrollment.member._id;

  if (!isMember) {
    return res.status('403').json({
      error: 'User is not enrolled'
    });
  }

  next();
};

const listEnrolled = async (req, res) => {
  try {
    let enrollments = await Enrollment.find({ member: req.auth._id })
      .sort({ completed: 1 })
      .populate('group', '_id name category');

    res.json(enrollments);
  } catch (error) {
    console.error(`An error occurred: ${error}`);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(error)
    });
  }
};

const findEnrollment = async (req, res, next) => {
  try {
    let enrollments = await Enrollment.find({
      group: req.group._id,
      member: req.auth._id
    });

    if (enrollments.length == 0) {
      next();
    } else {
      res.json(enrollments[0]);
    }
  } catch (error) {
    console.error(`A server error occurred: ${error}`);
    return res.status(400).json({ error: errorHandler.getErrorMessage(error) });
  }
};

const enrollmentStats = async (req, res) => {
  try {
    let stats = {};

    stats.totalEnrolled =
      await Enrollment
        .find({ group: req.group._id })
        .countDocuments();

    stats.totalCompleted =
      await Enrollment
        .find({ group: req.group._id })
        .exists('completed', true)
        .countDocuments();

    res.json(stats);
  } catch (error) {
    console.error(`A server error occurred: ${error}`);
    return res.status(400).json({ error: errorHandler.getErrorMessage(error) });
  }
};

export default {
  create,
  enrollmentByID,
  read,
  remove,
  complete,
  isMember,
  listEnrolled,
  findEnrollment,
  enrollmentStats
};
