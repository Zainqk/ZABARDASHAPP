import mongoose, { Model, Schema } from 'mongoose';

interface IngredientInterface {
	name: string;
	price: number;
	ingredient_qty_adding: number;
	instructions: string[];
	per_unit_price: number;
	size_per_unit: string;
	recipe_id: mongoose.Types.ObjectId;
	mart_id: mongoose.Types.ObjectId;
}

const ingredientSchema = new Schema<IngredientInterface>({
	name: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	ingredient_qty_adding: {
		type: Number,
		required: true,
	},
	instructions: {
		type: [String],
		required: true,
	},
	per_unit_price: {
		type: Number,
		required: true,
	},
	size_per_unit: {
		type: String,
		required: true,
	},
	recipe_id: {
		type: Schema.Types.ObjectId,
		ref: 'Recipe', // Reference to the Recipe model
		required: true,
	},
	mart_id: {
		type: Schema.Types.ObjectId,
		ref: 'Mart', // Reference to the Mart model
		required: true,
	},
});

const IngredientModel: Model<IngredientInterface> = mongoose.model(
	'Ingredient',
	ingredientSchema
);

export { IngredientInterface };
export default IngredientModel;
