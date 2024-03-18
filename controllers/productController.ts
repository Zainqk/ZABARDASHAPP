import { Request, Response } from 'express';
import Product from '../models/productModel';

const addProduct = async (req: Request, res: Response) => {
	try {
		const {
			name,
			category_id,
			user_id,
			description,
			price,
			stockQuantity,
			images,
			status,
			subtitle,
			isFeatured,
			variation,
			mart_id,
		} = req.body;

		// Create a new product object
		const newProduct = new Product({
			name,
			category_id,
			user_id,
			description,
			price,
			stockQuantity,
			images,
			status,
			subtitle,
			isFeatured,
			variation,
			mart_id,
		});

		// Save the new product to the database
		await newProduct.save();

		res
			.status(201)
			.json({ success: true, message: 'Product added successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

const getProductsByMartId = async (req: Request, res: Response) => {
	try {
		const { mart_id } = req.params;

		// Find products by mart_id
		const products = await Product.find({ mart_id });

		res.status(200).json({ success: true, products });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

export { addProduct, getProductsByMartId };
