import mongoose, { Model, Schema, Document } from 'mongoose';

interface PromotionInterface extends Document {
	name: string;
	vendor_id: Schema.Types.ObjectId; // Assuming this references the vendor ID
	starting_date: Date;
	end_date: Date;
	discount_value: number;
	min_order_amount: number;
	is_active: boolean;
}

const promotionSchema = new Schema<PromotionInterface>(
	{
		name: {
			type: String,
			required: true,
		},
		vendor_id: {
			type: Schema.Types.ObjectId,
			ref: 'Vendor', // Reference to the Vendor model assuming it exists
			required: true,
		},
		starting_date: {
			type: Date,
			required: true,
		},
		end_date: {
			type: Date,
			required: true,
		},
		discount_value: {
			type: Number,
			required: true,
		},
		min_order_amount: {
			type: Number,
			required: true,
		},
		is_active: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

const PromotionModel: Model<PromotionInterface> = mongoose.model(
	'Promotion',
	promotionSchema
);

export { PromotionInterface };
export default PromotionModel;
