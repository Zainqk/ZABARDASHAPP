import { Request, Response } from 'express';
import Product from '../models/productModel';
import Category from '../models/categoryModel';
import Mart from '../models/martModel';
import Saving from '../models/savingModel';

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
		const categories = await Category.find({}, '_id name');
		res.status(200).json({ success: true, products, categories: categories });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};
const getAllProducts = async (req: Request, res: Response) => {
	try {
		const products = await Product.find();

		res.status(200).json({ success: true, products });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};
const addSavingProduct = async (req: Request, res: Response) => {
	try {
		const { is_saving, saving_price, images, product_id } = req.body;

		// Create a new product object
		const newProduct = new Saving({
			is_saving,
			saving_price,
			images,
			product_id,
		});

		// Save the new product to the database
		await newProduct.save();

		res
			.status(201)
			.json({ success: true, message: 'Saving product added successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};
const getSavingProducts = async (req: Request, res: Response) => {
	try {
		const savingProducts = await Saving.aggregate([
			// Match saving entries where is_saving is true
			{ $match: { is_saving: true } },
			// Lookup products with matching product_id
			{
				$lookup: {
					from: 'products', // Name of the product collection
					localField: 'product_id',
					foreignField: '_id',
					as: 'product',
				},
			},
			// Unwind the resulting array
			{ $unwind: '$product' },
			// Project to include only the product fields
			{
				$project: {
					_id: '$product._id',
					name: '$product.name',
					images: '$product.images',
					status: '$product.status',
					isFeatured: '$product.isFeatured',
				},
			},
		]);

		// Check if there are any saving products
		if (!savingProducts || savingProducts.length === 0) {
			return res
				.status(404)
				.json({ success: false, message: 'No saving products found' });
		}

		res.status(200).json({ success: true, saving_products: savingProducts });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};
// api's
const getSavingProductsById = async (req: Request, res: Response) => {
	try {
		const { id, name } = req.query;

		if (!name || typeof name !== 'string') {
			return res
				.status(400)
				.json({ success: false, message: 'Invalid product name' });
		}
		const regex = new RegExp(name, 'i');

		const marts = await Product.find({ name: { $regex: regex } })
			.populate({
				path: 'mart_id',
			})
			.select(
				'-_id -name -category_id -user_id -mart_id -description -price -stockQuantity -images -status -subtitle -isFeatured -variation -createdAt -updatedAt -__v'
			)
			.exec();

		const savingProducts = await Saving.find({
			is_saving: true,
			product_id: id,
		});

		// Check if there are any saving products
		if (!savingProducts || savingProducts.length === 0) {
			return res
				.status(404)
				.json({ success: false, message: 'No saving products found' });
		}

		res
			.status(200)
			.json({ success: true, saving_products: savingProducts, marts: marts });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

const getMartsByProductName = async (req: Request, res: Response) => {
	try {
		const { name } = req.query;

		if (!name || typeof name !== 'string') {
			return res
				.status(400)
				.json({ success: false, message: 'Invalid product name' });
		}
		const regex = new RegExp(name, 'i');

		const marts = await Product.find({ name: { $regex: regex } })
			.populate({
				path: 'mart_id',
			})
			.select(
				'-_id -name -category_id -user_id -mart_id -description -price -stockQuantity -images -status -subtitle -isFeatured -variation -createdAt -updatedAt -__v'
			)
			.exec();

		res.status(200).json({ success: true, marts: marts });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

export {
	addProduct,
	getProductsByMartId,
	getAllProducts,
	addSavingProduct,
	getSavingProducts,
	getSavingProductsById,
	getMartsByProductName,
};
