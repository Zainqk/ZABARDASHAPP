import mongoose, { Model, Schema } from 'mongoose';

interface DeliveryFeeInterface {
	order_id: mongoose.Types.ObjectId; // Foreign key from order
	delivery_fee: number;
}

const deliveryFeeSchema = new Schema<DeliveryFeeInterface>(
	{
		order_id: {
			type: Schema.Types.ObjectId,
			ref: 'Order', // Reference to the Order model
			required: true,
		},
		delivery_fee: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);

const DeliveryFeeModel: Model<DeliveryFeeInterface> = mongoose.model(
	'DeliveryFee',
	deliveryFeeSchema
);

export { DeliveryFeeInterface };
export default DeliveryFeeModel;
