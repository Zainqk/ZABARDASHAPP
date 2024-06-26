import mongoose, { Model, Schema } from 'mongoose';

interface ProductInterface {
	name: string;
	category_id: mongoose.Types.ObjectId; // Adjusted the type to mongoose.Types.ObjectId
	vendor_id: mongoose.Types.ObjectId;
	mart_id: mongoose.Types.ObjectId;
	description: string;
	price: number;
	discount_price: number;
	stockQuantity: number;
	images: string;
	status: string;
	subtitle: string;
	isFeatured: string;
	variation: {
		title: string;
		price: number;
	}[];
}

const productSchema = new Schema<ProductInterface>(
	{
		name: {
			type: String,
			required: true,
		},
		category_id: {
			type: Schema.Types.ObjectId,
			ref: 'Category', // Ensure 'Category' is the correct model name
			required: true,
		},
		vendor_id: {
			type: Schema.Types.ObjectId,
			ref: 'User', // Ensure 'User' is the correct model names
			required: true,
		},
		mart_id: {
			type: Schema.Types.ObjectId,
			ref: 'Mart', // Ensure 'User' is the correct model names
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		discount_price: {
			type: Number,
			default: 0,
		},
		stockQuantity: {
			type: Number,
			required: true,
		},
		images: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			required: true,
		},
		subtitle: {
			type: String,
			required: true,
		},
		isFeatured: {
			type: String,
			required: false,
			default: 'false',
		},
		variation: [
			{
				title: {
					type: String,
					required: true,
				},
				price: {
					type: Number,
					required: true,
				},
			},
		],
	},
	{ timestamps: true }
);

const ProductModal: Model<ProductInterface> = mongoose.model(
	'Product',
	productSchema
);

export { ProductInterface };
export default ProductModal;
