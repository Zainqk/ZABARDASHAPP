import mongoose, { Model, Schema } from 'mongoose';

// Define the interface for the Order
interface OrderInterface {
	customerId: mongoose.Types.ObjectId;
	martId: mongoose.Types.ObjectId;
	status: string;
	paymentStatus: string;
	paymentMethod: string;
	shippingAddress: string;
	subtotal: number;
	discounts: number;
	product: {
		product_id: mongoose.Types.ObjectId;
		quantity: number;
		variant_id: string;
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
		customerId: {
			type: Schema.Types.ObjectId,
			ref: 'User', // Reference to the User model
			required: true,
		},
		martId: {
			type: Schema.Types.ObjectId,
			ref: 'Mart', // Reference to the User model
			required: true,
		},
		status: {
			type: String,
			default: 'Pending',
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
				quantity: { type: Number, required: true, default: 1 },
				variant_id: {
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
