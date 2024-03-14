import mongoose, { Model, Schema } from 'mongoose';

interface QuantityInterface {
	product_id: mongoose.Types.ObjectId;
	quantity: number;
}

const quantitySchema = new Schema<QuantityInterface>(
	{
		product_id: {
			type: Schema.Types.ObjectId,
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);

const QuantityModel: Model<QuantityInterface> = mongoose.model(
	'Quantity',
	quantitySchema
);

export { QuantityInterface };
export default QuantityModel;
