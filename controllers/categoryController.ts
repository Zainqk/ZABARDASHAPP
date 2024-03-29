import { Request, Response } from 'express';
import Category from '../models/categoryModel';
const addCategory = async (req: Request, res: Response) => {
	try {
		const { name, desc } = req.body;

		console.log('the data is:', name, desc);

		// Check if both name and desc are provided
		if (!name || !desc) {
			return res
				.status(400)
				.json({ success: false, message: 'Both name and desc are required' });
		}

		// Create a new category object
		const newCategory = new Category({
			name,
			desc,
		});

		// Save the new category to the database
		await newCategory.save();

		res
			.status(201)
			.json({ success: true, message: 'Category added successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

export { addCategory };
