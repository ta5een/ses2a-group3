import express from 'express';
import enrollmentCtrl from '../controllers/enrollment.controller';
import groupCtrl from '../controllers/group.controller';
import authCtrl from '../controllers/auth.controller';

const router = express.Router();

router.route('/api/enrollment/enrolled').get(authCtrl.requireSignin, enrollmentCtrl.listEnrolled);

router
	.route('/api/enrollment/new/:groupId')
	.post(authCtrl.requireSignin, enrollmentCtrl.findEnrollment, enrollmentCtrl.create);

router.route('/api/enrollment/stats/:groupId').get(enrollmentCtrl.enrollmentStats);

router
	.route('/api/enrollment/complete/:enrollmentId')
	.put(authCtrl.requireSignin, enrollmentCtrl.isMember, enrollmentCtrl.complete);

router
	.route('/api/enrollment/:enrollmentId')
	.get(authCtrl.requireSignin, enrollmentCtrl.isMember, enrollmentCtrl.read)
	.delete(authCtrl.requireSignin, enrollmentCtrl.isMember, enrollmentCtrl.remove);

router.param('groupId', groupCtrl.groupByID);
router.param('enrollmentId', enrollmentCtrl.enrollmentByID);

export default router;
