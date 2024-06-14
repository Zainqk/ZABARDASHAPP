import mongoose, { Model, Schema } from 'mongoose';

interface AddressInterface {
	customer_id: mongoose.Schema.Types.ObjectId;
	title: string;
	address: string;
}

const addressSchema = new Schema<AddressInterface>(
	{
		customer_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Customer',
			required: true,
		},

		title: {
			type: String,
			required: true,
		},
		address: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
); // Enable timestamps with createdAt and updatedAt fields

const AddressModel: Model<AddressInterface> = mongoose.model(
	'Address',
	addressSchema
);

export { AddressInterface };
export default AddressModel;
