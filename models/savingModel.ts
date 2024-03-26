import mongoose, { Model, Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

interface SavingInterface extends Document {
	is_saving: boolean;
	saving_price?: number; // Optional field
	images?: string[]; // Array of strings for image URLs
	product_id?: mongoose.Types.ObjectId; // Foreign key for product
}

const savingSchema = new Schema<SavingInterface>({
	is_saving: {
		type: Boolean,
		required: true,
		default: false,
	},
	saving_price: {
		type: Number,
	},
	images: [
		{
			type: String,
		},
	],
	product_id: {
		type: Schema.Types.ObjectId,
		ref: 'Product', // Assuming 'Product' is the name of the model representing products
	},
});

const UserModal: Model<SavingInterface> = mongoose.model<SavingInterface>(
	'Saving',
	savingSchema
);

export { SavingInterface };
export default UserModal;
