import mongoose, { Model, Schema } from 'mongoose';

interface DeliveryChargesInterface {
	delivery_Charge: number;
}

const deliveryChargesSchema = new Schema<DeliveryChargesInterface>(
	{
		delivery_Charge: {
			type: Number,
			// required: true,
		},
	},
	{ timestamps: true } // Enable timestamps with createdAt and updatedAt fields
);

const DeliveryChargesModel: Model<DeliveryChargesInterface> = mongoose.model(
	'DeliveryCharges',
	deliveryChargesSchema
);

export { DeliveryChargesInterface };
export default DeliveryChargesModel;
