import defaultImage from '../../client/assets/images/avatar.png';
import extend from 'lodash/extend';
import errorHandler from '../helpers/dbErrorHandler';
import formidable from 'formidable';
import fs from 'fs';
import Group from '../models/group.model';

const create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (error, fields, files) => {
    if (error) {
      return res.status(400).json({ error: 'Image could not be uploaded' });
    }

    let group = new Group(fields);
    group.moderator = req.profile;

    if (files.image) {
      group.image.data = fs.readFileSync(files.image.path);
      group.image.contentType = files.image.type;
    }

    try {
      let result = await group.save();
      res.json(result);
    } catch (error) {
      console.error(`A server error occurred: ${error}`);
      return res.status(400).json({ error: errorHandler.getErrorMessage(error) });
    }
  });
};

/**
 * Load course and append to req.
 */
const groupByID = async (req, res, next, id) => {
  try {
    let group = await Group.findById(id).populate('moderator', '_id name');
    if (!group) {
      return res.status('400').json({ error: 'Group not found' });
    }

    req.group = group;
    next();
  } catch (error) {
    console.error(`A server error occurred: ${error}`);
    return res.status('400').json({ error: 'Could not retrieve group' });
  }
};

const read = (req, res) => {
  req.group.image = undefined;
  return res.json(req.group);
};

const list = async (_req, res) => {
  try {
    let groups = await Group.find().select('name email updated created');
    res.json(groups);
  } catch (error) {
    console.error(`A server error occurred: ${error}`);
    return res.status(400).json({ error: errorHandler.getErrorMessage(error) });
  }
};

const update = async (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (error, fields, files) => {
    if (error) {
      return res.status(400).json({
        error: 'Photo could not be uploaded'
      });
    }

    let group = req.group;
    group = extend(group, fields);

    if (fields.contents) {
      group.contents = JSON.parse(fields.contents);
    }

    group.updated = Date.now();

    if (files.image) {
      group.image.data = fs.readFileSync(files.image.path);
      group.image.contentType = files.image.type;
    }

    try {
      await group.save();
      res.json(group);
    } catch (error) {
      console.error(`A server error occurred: ${error}`);
      return res.status(400).json({ error: errorHandler.getErrorMessage(error) });
    }
  });
};

const newContent = async (req, res) => {
  try {
    let content = req.body.content;

    let result =
      await Group.findByIdAndUpdate(
        req.group._id,
        { $push: { contents: content }, updated: Date.now() },
        { new: true }
      )
        .populate('moderator', '_id name')
        .exec();

    res.json(result);
  } catch (error) {
    console.error(`A server error occurred: ${error}`);
    return res.status(400).json({ error: errorHandler.getErrorMessage(error) });
  }
};

const remove = async (req, res) => {
  try {
    let group = req.group;
    let deleteGroup = await group.remove();
    res.json(deleteGroup);
  } catch (error) {
    console.error(`A server error occurred: ${error}`);
    return res.status(400).json({ error: errorHandler.getErrorMessage(error) })
  }
};

const isModerator = (req, res, next) => {
  const isModerator = req.group && req.auth && req.group.moderator._id == req.auth._id;
  if (!isModerator) {
    return res.status('403').json({ error: 'User is not authorized' });
  }
  next();
};

const listByModerator = (req, res) => {
  Group.find({ moderator: req.profile._id }, (error, groups) => {
    if (error) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(error)
      });
    }
    res.json(groups);
  }).populate('moderator', '_id name');
};

const listPublished = (_req, res) => {
  Group.find({ published: true }, (error, groups) => {
    if (error) {
      return res.status(400).json({ error: errorHandler.getErrorMessage(error) });
    }
    res.json(groups);
  }).populate('instructor', '_id name');
};

const photo = (req, res, next) => {
  if (req.group.image.data) {
    res.set('Content-Type', req.group.image.contentType);
    return res.send(req.group.image.data);
  }
  next();
};

const defaultPhoto = (_req, res) => {
  return res.sendFile(process.cwd() + defaultImage);
};

const listCategories = async (_req, res) => {
  try {
    let groups = await Group.distinct('category', {});
    res.json(groups);
  } catch (error) {
    console.error(`A server error occurred: ${error}`);
    return res.status(400).json({ error: errorHandler.getErrorMessage(error) });
  }
};

const listSearch = async (req, res) => {
  const query = {};

  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: 'i' };
  }

  if (req.query.category && req.query.category != 'All') {
    query.category = req.query.category;
  }

  try {
    let groups = await Group.find(query).populate('group', '_id name').select('-image').exec();
    res.json(groups);
  } catch (error) {
    console.error(`A server error occurred: ${error}`);
    return res.status(400).json({ error: errorHandler.getErrorMessage(error) });
  }
};

export default {
  create,
  groupByID,
  read,
  list,
  remove,
  update,
  isModerator,
  listByModerator,
  photo,
  defaultPhoto,
  newContent,
  listPublished,
  listCategories,
  listSearch,
};
