import authCtrl from '../controllers/auth.controller';
import express from 'express';
import groupCtrl from '../controllers/group.controller';
import userCtrl from '../controllers/user.controller';

const router = express.Router();

router
  .route('/api/groups/published')
  .get(groupCtrl.listPublished);

router
  .route('/api/groups/by/:userId')
  .post(authCtrl.requireSignIn, authCtrl.hasAuthorization, userCtrl.isAdmin, groupCtrl.create)
  .get(authCtrl.requireSignIn, authCtrl.hasAuthorization, groupCtrl.listByModerator);

router
  .route('/api/groups/photo/:groupId')
  .get(groupCtrl.photo, groupCtrl.defaultPhoto);

router
  .route('/api/groups/defaultphoto')
  .get(groupCtrl.defaultPhoto);

router
  .route('/api/groups/:groupId/content/new')
  .put(authCtrl.requireSignIn, groupCtrl.isModerator, groupCtrl.newContent);

router
  .route('/api/groups/:groupId')
  .get(groupCtrl.read)
  .put(authCtrl.requireSignIn, groupCtrl.isModerator, groupCtrl.update)
  .delete(authCtrl.requireSignIn, groupCtrl.isModerator, groupCtrl.remove);

router
  .route('/api/groups/categories')
  .get(groupCtrl.listCategories);

router
  .route('/api/groups')
  .get(groupCtrl.listSearch);

router.param('groupId', groupCtrl.groupByID);
router.param('userId', userCtrl.userByID);

export default router;
