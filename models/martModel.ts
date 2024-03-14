import mongoose, { Model, Schema } from 'mongoose';

interface MartInterface {
	name: string;
	address: string;
	img: string;
	isFeatured: boolean;
	no_of_views: number;
	vendor_id: mongoose.Types.ObjectId; // Foreign key from customer_id
}

const martSchema = new Schema<MartInterface>(
	{
		name: {
			type: String,
			required: true,
		},
		address: {
			type: String,
			required: true,
		},
		img: {
			type: String,
			required: true,
		},
		isFeatured: {
			type: Boolean,
		},
		no_of_views: {
			type: Number,
		},
		vendor_id: {
			type: Schema.Types.ObjectId,
			ref: 'User', // Assuming 'Customer' is the name of the model representing vendors
			required: true,
		},
	},
	{ timestamps: true }
);

const MartModel: Model<MartInterface> = mongoose.model('Mart', martSchema);

export { MartInterface };
export default MartModel;
