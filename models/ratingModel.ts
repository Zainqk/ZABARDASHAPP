import mongoose, { Model, Schema, ObjectId } from 'mongoose';

interface RatingInterface {
	customer_id: ObjectId; // Assuming customer_id is a foreign key referencing the Customer model
	mart_id: ObjectId;
	no_of_rating: number;
	comment: string;
}

const ratingSchema = new Schema<RatingInterface>(
	{
		customer_id: {
			type: mongoose.Types.ObjectId,
			ref: 'User', // Assuming Customer is the name of the model referenced by customer_id
			required: true,
		},
		mart_id: {
			type: mongoose.Types.ObjectId,
			ref: 'Mart',
			required: true,
		},
		no_of_rating: {
			type: Number,
			required: true,
		},
		comment: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
); // Enable timestamps with createdAt and updatedAt fields

const RatingModel: Model<RatingInterface> = mongoose.model(
	'Rating',
	ratingSchema
);

export { RatingInterface };
export default RatingModel;
