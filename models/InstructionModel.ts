import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the recipe document
interface InstructionInterface extends Document {
	instructions: string[];
	recipe_id: mongoose.Types.ObjectId;
}

// Define the schema for the recipe
const instructionSchema: Schema<InstructionInterface> = new Schema(
	{
		instructions: {
			type: [String],
			required: true,
		},
		recipe_id: {
			type: Schema.Types.ObjectId,
			ref: 'Recipe', // Reference to the Recipe model
			required: true,
		},
	},
	{ timestamps: true }
); // Enable timestamps for createdAt and updatedAt fields

// Create the Recipe model
const InstructionModel = mongoose.model<InstructionInterface>(
	'Instruction',
	instructionSchema
);
export { InstructionInterface };
export default InstructionModel;
