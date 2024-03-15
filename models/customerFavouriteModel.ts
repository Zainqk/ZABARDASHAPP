import mongoose, { Model, Schema } from 'mongoose';

interface CustomerFavouriteInterface {
	customer_id: Schema.Types.ObjectId; // Foreign key from customer_id
	mart_id: Schema.Types.ObjectId;
	isFavourite: Boolean;
}

const customerFavouriteSchema = new Schema<CustomerFavouriteInterface>(
	{
		customer_id: {
			type: Schema.Types.ObjectId,
			ref: 'Customer', // Reference to the Customer model
			required: true,
		},
		mart_id: {
			type: Schema.Types.ObjectId,
			ref: 'Mart', // Reference to the Mart model
			required: true,
		},
		isFavourite: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

const CustomerFavouriteModel: Model<CustomerFavouriteInterface> =
	mongoose.model('CustomerFavourite', customerFavouriteSchema);

export { CustomerFavouriteInterface };
export default CustomerFavouriteModel;
