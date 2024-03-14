import mongoose, { Model, Schema } from 'mongoose';

// Define the interface for the Order
interface OrderInterface {
	customerID: mongoose.Types.ObjectId;
	status: string;
	paymentStatus: string;
	paymentMethod: string;
	shippingAddress: string;
	subtotal: number;
	discounts: number;
	product: {
		product_id: mongoose.Types.ObjectId;
		variant_title: string;
	}[];
	taxAmount: number;
	shippingFee: number;
	totalAmount: number;
	specialInstruction: string;
	cancellation_reason: string;
}

// Define the schema for the Order
const orderSchema = new Schema<OrderInterface>(
	{
		customerID: {
			type: Schema.Types.ObjectId,
			ref: 'User', // Reference to the User model
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
		subtotal: {
			type: Number,
			required: true,
		},
		discounts: {
			type: Number,
			required: true,
		},
		product: [
			{
				product_id: {
					type: Schema.Types.ObjectId,
					ref: 'Product', // Reference to the Product model
					required: true,
				},
				variant_title: {
					type: String,
					required: true,
				},
			},
		],
		taxAmount: {
			type: Number,
			required: true,
		},
		totalAmount: {
			type: Number,
			required: true,
		},
		specialInstruction: {
			type: String,
			required: true,
		},
		cancellation_reason: {
			type: String,
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
