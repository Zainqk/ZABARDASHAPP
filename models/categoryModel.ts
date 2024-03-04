import mongoose, { Model, Schema } from 'mongoose';

interface CategoryInterface {
	name: string;
	desc: string;
}

const categorySchema = new Schema<CategoryInterface>(
	{
		name: {
			type: String,
			required: true,
		},
		desc: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
); // Enable timestamps with createdAt and updatedAt fields

const CategoryModel: Model<CategoryInterface> = mongoose.model(
	'Category',
	categorySchema
);

export { CategoryInterface };
export default CategoryModel;
