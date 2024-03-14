import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the recipe document
interface RecipeInterface extends Document {
	name: string;
	prep_time: number;
	cook_time: number;
	status: string;
	img: string;
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
	},
	{ timestamps: true }
); // Enable timestamps for createdAt and updatedAt fields

// Create the Recipe model
const RecipeModel = mongoose.model<RecipeInterface>('Recipe', recipeSchema);

export { RecipeInterface, RecipeModel };
