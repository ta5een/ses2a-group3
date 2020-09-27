import authCtrl from '../controllers/auth.controller';
import enrollmentCtrl from '../controllers/enrollment.controller';
import express from 'express';
import groupCtrl from '../controllers/group.controller';

const router = express.Router();

router
  .route('/api/enrollment/enrolled')
  .get(authCtrl.requireSignIn, enrollmentCtrl.listEnrolled);

router
  .route('/api/enrollment/new/:groupId')
  .post(authCtrl.requireSignIn, enrollmentCtrl.findEnrollment, enrollmentCtrl.create);

router
  .route('/api/enrollment/stats/:groupId')
  .get(enrollmentCtrl.enrollmentStats);

router
  .route('/api/enrollment/complete/:enrollmentId')
  .put(authCtrl.requireSignIn, enrollmentCtrl.isMember, enrollmentCtrl.complete);

router
  .route('/api/enrollment/:enrollmentId')
  .get(authCtrl.requireSignIn, enrollmentCtrl.isMember, enrollmentCtrl.read)
  .delete(authCtrl.requireSignIn, enrollmentCtrl.isMember, enrollmentCtrl.remove);

router.param('groupId', groupCtrl.groupByID);
router.param('enrollmentId', enrollmentCtrl.enrollmentByID);

export default router;
