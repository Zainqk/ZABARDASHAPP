import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the recipe document
interface RecipeInterface extends Document {
	name: string;
	category_id: mongoose.Types.ObjectId;
	description: string;
	ingredients: string[];
	instructions: string;
	images: string[];
	reviews: string[];
	rating: number;
}

// Define the schema for the recipe
const recipeSchema: Schema<RecipeInterface> = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		category_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category', // Assuming you have a Category schema defined
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		ingredients: {
			type: [String],
			required: true,
		},
		instructions: {
			type: String,
			required: true,
		},
		images: {
			type: [String],
			required: true,
		},
		reviews: {
			type: [String],
			default: [],
		},
		rating: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
); // Enable timestamps for createdAt and updatedAt fields

// Create the Recipe model
const RecipeModel = mongoose.model<RecipeInterface>('Recipe', recipeSchema);

export { RecipeInterface, RecipeModel };
