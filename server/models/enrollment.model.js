import mongoose from 'mongoose';

const EnrollmentSchema = new mongoose.Schema({
	group: { type: mongoose.Schema.ObjectId, ref: 'Group' },
	updated: Date,
	enrolled: {
		type: Date,
		default: Date.now
	},
	member: { type: mongoose.Schema.ObjectId, ref: 'User' },
	contentStatus: [
		{
			content: { type: mongoose.Schema.ObjectId, ref: 'Content' },
			complete: Boolean
		}
	],
	completed: Date
});

export default mongoose.model('Enrollment', EnrollmentSchema);
