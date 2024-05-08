import { Request, Response } from 'express';
import Product from '../models/productModel';
import Category from '../models/categoryModel';
import Mart from '../models/martModel';
import Saving from '../models/savingModel';
import QuantityModel from '../models/quantityModel';

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
			threshold,
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

		// Create a new product quantity object
		const newProductQuantity = new QuantityModel({
			product_id: newProduct._id, // Use the _id of the newly created product
			quantity: stockQuantity, // Set the initial quantity
			threshold: threshold, // Set the threshold for low stock alert
		});

		// Save the new product quantity to the database
		await newProductQuantity.save();

		res
			.status(201)
			.json({ success: true, message: 'Product added successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

const editProduct = async (req: Request, res: Response) => {
	try {
		const productId = req.params.id;
		const updateFields = req.body;

		// Find the product by ID and update its fields
		const updatedProduct = await Product.findByIdAndUpdate(
			productId,
			updateFields,
			{ new: true }
		);

		if (!updatedProduct) {
			return res
				.status(404)
				.json({ success: false, message: 'Product not found' });
		}

		res.status(200).json({
			success: true,
			message: 'Product updated successfully',
			updatedProduct,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};
const deleteProduct = async (req: Request, res: Response) => {
	try {
		const productId = req.params.id;

		// Find the product by ID and delete it
		const deletedProduct = await Product.findByIdAndDelete(productId);

		if (!deletedProduct) {
			return res
				.status(404)
				.json({ success: false, message: 'Product not found' });
		}

		res
			.status(200)
			.json({ success: true, message: 'Product deleted successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

const getProductsByMartId = async (req: Request, res: Response) => {
	try {
		const { mart_id, category_id, isFeatured, searchByName } = req.query;
		let query: {
			mart_id: string;
			category_id?: any;
			isFeatured?: string;
			name?: RegExp;
		} = {
			mart_id: mart_id as string,
		};

		if (category_id) {
			if (Array.isArray(category_id)) {
				// If category_id is an array, use it as is
				query.category_id = { $in: category_id };
			} else {
				// If category_id is a single value, convert it to an array
				query.category_id = [category_id];
			}
		}
		if (isFeatured) {
			query.isFeatured = isFeatured as string;
		}
		if (searchByName) {
			query.name = new RegExp(searchByName as string, 'i');
		}

		// Find products by mart_id and optional category_id
		const products = await Product.find(query).populate('category_id', {
			_id: 1,
			name: 1,
		});
		const categories = await Category.find({}, '_id name');
		const martDetail = await Mart.findById(mart_id);
		res.status(200).json({
			success: true,
			products,
			categories: categories,
			mart: martDetail,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};
const getAllProducts = async (req: Request, res: Response) => {
	try {
		const products = await Product.find().populate('category_id', {
			_id: 1,
			name: 1,
		});

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
			// Lookup categories for each product
			{
				$lookup: {
					from: 'categories', // Name of the category collection
					localField: 'product.category_id',
					foreignField: '_id',
					as: 'category',
				},
			},
			// Unwind the resulting array
			{ $unwind: '$category' },
			// Project to include only the product and category fields
			{
				$project: {
					_id: '$product._id',
					name: '$product.name',
					images: '$product.images',
					status: '$product.status',
					isFeatured: '$product.isFeatured',
					category: '$category',
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
		})
			.populate({
				path: 'product_id',
				populate: {
					path: 'category_id',
					model: 'Category', // Assuming 'Category' is the name of your category model
				},
			})
			.exec();

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

const getSavingProductsByCategoryId = async (req: Request, res: Response) => {
	try {
		const { id } = req.query;

		const savingProducts = await Saving.find({
			is_saving: true,
		})
			.populate({
				path: 'product_id',
				populate: {
					path: 'category_id',
					model: 'Category', // Assuming 'Category' is the name of your category model
				},
			})
			.exec();

		// Check if there are any saving products
		if (!savingProducts || savingProducts.length === 0) {
			return res
				.status(404)
				.json({ success: false, message: 'No saving products found' });
		}
		// Filter saving products by category ID
		const filteredProducts = savingProducts.filter((savingProduct) => {
			// Check if the product's category ID matches the provided category ID
			// @ts-ignore
			return savingProduct.product_id.category_id === id;
		});

		// Check if there are any saving products matching the category ID
		if (!filteredProducts || filteredProducts.length === 0) {
			return res.status(404).json({
				success: false,
				message: 'No saving products found for the provided category ID',
			});
		}

		res.status(200).json({ success: true, saving_products: filteredProducts });
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
	editProduct,
	deleteProduct,
	getSavingProductsByCategoryId,
};
