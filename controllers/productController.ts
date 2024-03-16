import { Request, Response } from 'express';
import Product from '../models/productModel';

//addProduct
const addProduct = async (req: Request, res: Response) => {
	try {
		const { name, address, vendor_id, img } = req.body;

		// Create a new mart object
		const newProduct = new Product({
			name,
			address,
			img: img,
			vendor_id,
		});

		// Save the new mart to the database
		await newProduct.save();

		res.status(201).json({ success: true, message: 'Mart added successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

export { addProduct };
