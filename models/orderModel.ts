import mongoose, { Model, Schema } from 'mongoose';

// Define the interface for the Order
interface OrderInterface {
	customerID: mongoose.Types.ObjectId;
	date: Date;
	time: string;
	status: string;
	paymentStatus: string;
	paymentMethod: string;
	shippingAddress: string;
	totalAmount: number;
	discounts: number;
	items_id: mongoose.Types.ObjectId[];
	taxAmount: number;
	shippingFee: number;
	totalPayment: number;
}

// Define the schema for the Order
const orderSchema = new Schema<OrderInterface>(
	{
		customerID: {
			type: Schema.Types.ObjectId,
			ref: 'User', // Reference to the User model
			required: true,
		},
		date: {
			type: Date,
			required: true,
		},
		time: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			required: true,
		},
		paymentStatus: {
			type: String,
			required: true,
		},
		paymentMethod: {
			type: String,
			required: true,
		},
		shippingAddress: {
			type: String,
			required: true,
		},
		totalAmount: {
			type: Number,
			required: true,
		},
		discounts: {
			type: Number,
			required: true,
		},
		items_id: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Product', // Reference to the Product model
				required: true,
			},
		],
		taxAmount: {
			type: Number,
			required: true,
		},
		shippingFee: {
			type: Number,
			required: true,
		},
		totalPayment: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

// Create the Order model
const OrderModal: Model<OrderInterface> = mongoose.model('Order', orderSchema);

export { OrderInterface };
export default OrderModal;
