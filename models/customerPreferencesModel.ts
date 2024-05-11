import mongoose, { Model, Schema, Document } from 'mongoose';

// Define interface for customer preference
interface CustomerPreferenceInterface extends Document {
	customerId: mongoose.Types.ObjectId;
	categoryPreferences: mongoose.Types.ObjectId;
	martId: mongoose.Types.ObjectId;
	price: number;
}

// Define schema for customer preference
const customerPreferenceSchema = new Schema<CustomerPreferenceInterface>(
	{
		customerId: {
			type: Schema.Types.ObjectId,
			ref: 'Customer', // Reference to the Customer model
			required: true,
		},
		categoryPreferences: {
			type: Schema.Types.ObjectId,
			ref: 'Category',
			required: true,
		},
		martId: {
			type: Schema.Types.ObjectId,
			ref: 'Mart',
			required: true,
		},
		price: {
			type: Number,
		},
	},
	{ timestamps: true }
);

// Create the CustomerPreference model
const CustomerPreferenceModel: Model<CustomerPreferenceInterface> =
	mongoose.model('CustomerPreference', customerPreferenceSchema);

export { CustomerPreferenceInterface };
export default CustomerPreferenceModel;
