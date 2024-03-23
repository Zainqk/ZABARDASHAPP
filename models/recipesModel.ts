import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the recipe document
interface RecipeInterface extends Document {
	name: string;
	prep_time: number;
	cook_time: number;
	instructions: string[];
	status: string;
	img: string;
	mart_id: mongoose.Types.ObjectId[];
}

// Define the schema for the recipe
const recipeSchema: Schema<RecipeInterface> = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		prep_time: {
			type: Number,
			required: true,
		},
		cook_time: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			required: true,
		},
		img: {
			type: String,
			required: true,
		},
		instructions: {
			type: [String],
			required: true,
		},
		mart_id: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Mart', // Reference to the Mart model
				required: true,
			},
		],
	},
	{ timestamps: true }
); // Enable timestamps for createdAt and updatedAt fields

// Create the Recipe model
const RecipeModel = mongoose.model<RecipeInterface>('Recipe', recipeSchema);
export { RecipeInterface };
export default RecipeModel;
