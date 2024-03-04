import mongoose, { Model, Schema } from 'mongoose';

interface FeedbackInterface {
	order_id: mongoose.Types.ObjectId;
	user_id: mongoose.Types.ObjectId;
	comment: string;
	rating: number;
}

const feedbackSchema = new Schema<FeedbackInterface>(
	{
		order_id: {
			type: Schema.Types.ObjectId,
			ref: 'Order', // Assuming 'Order' is the name of your Order model
			required: true,
		},
		user_id: {
			type: Schema.Types.ObjectId,
			ref: 'User', // Assuming 'User' is the name of your User model
			required: true,
		},
		comment: {
			type: String,
			required: true,
		},
		rating: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);

const FeedbackModel: Model<FeedbackInterface> = mongoose.model(
	'Feedback',
	feedbackSchema
);

export { FeedbackInterface, FeedbackModel };
