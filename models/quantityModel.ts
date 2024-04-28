import mongoose, { Model, Schema, ObjectId } from 'mongoose';

// Define the interface for product quantity
interface QuantityInterface {
	product_id: ObjectId; // Assuming product_id is a foreign key referencing the Product model
	quantity: number;
	threshold: number; // Threshold for low stock alert
}

// Define the schema for product quantity
const quantitySchema = new Schema<QuantityInterface>({
	product_id: {
		type: mongoose.Types.ObjectId,
		ref: 'Product', // Assuming 'Product' is the name of the model referenced by product_id
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
	},
	threshold: {
		type: Number,
		required: true,
	},
});

// Create the Quantity model
const QuantityModel: Model<QuantityInterface> = mongoose.model(
	'Quantity',
	quantitySchema
);

export { QuantityInterface };
export default QuantityModel;
