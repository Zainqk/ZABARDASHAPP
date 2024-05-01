import mongoose, { Model, Schema } from 'mongoose';

interface InventoryInterface {
	product_id: mongoose.Types.ObjectId;
	qty: number;
	date: Date;
}

const inventorySchema = new Schema<InventoryInterface>({
	product_id: {
		type: Schema.Types.ObjectId,
		ref: 'Product', // Reference to the Product model
		required: true,
	},
	qty: {
		type: Number,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

const InventoryModel: Model<InventoryInterface> = mongoose.model(
	'Inventory',
	inventorySchema
);

export { InventoryInterface };
export default InventoryModel;
