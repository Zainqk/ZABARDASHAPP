import mongoose, { Model, Schema } from 'mongoose';

interface IngredientInterface {
	name: string;
	description: string;
	category_id: mongoose.Types.ObjectId;
	quantityInStock: number;
	dateAdded: Date;
}

const ingredientSchema = new Schema<IngredientInterface>({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	category_id: {
		type: Schema.Types.ObjectId,
		ref: 'Category', // Assuming you have a Category model
		required: true,
	},
	quantityInStock: {
		type: Number,
		required: true,
	},
	dateAdded: {
		type: Date,
		default: Date.now,
	},
});

const IngredientModel: Model<IngredientInterface> = mongoose.model(
	'Ingredient',
	ingredientSchema
);

export { IngredientInterface };
export default IngredientModel;
