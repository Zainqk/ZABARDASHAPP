import { Request, Response } from 'express';
import Recipe from '../models/recipesModel';
import path from 'path';
//addRecipes
const addRecipes = async (req: Request, res: Response) => {
	try {
		const { name, prep_time, cook_time, status, img } = req.body;

		// Create a new recipe object
		const newRecipe = new Recipe({
			name,
			prep_time,
			cook_time,
			status,
			img,
		});

		// Save the new recipe to the database
		await newRecipe.save();

		res
			.status(201)
			.json({ success: true, message: 'Recipe added successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};
const getAllRecipes = async (req: Request, res: Response) => {
	try {
		// Retrieve all recipes from the database
		const recipes = await Recipe.find();

		res.status(200).json({ success: true, data: recipes });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

export { addRecipes, getAllRecipes };
