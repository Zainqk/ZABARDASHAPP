import { Request, Response } from 'express';
import InventoryModel from '../models/inventoryModel';
import Ingredient from '../models/ingredientModel';
import Instruction from '../models/InstructionModel';
import path from 'path';
//addInventory
const addInventory = async (req: Request, res: Response) => {
	try {
		const { product_id, qty } = req.body;

		const newInventory = new InventoryModel({
			product_id,
			qty,
		});

		await newInventory.save();

		res
			.status(201)
			.json({ success: true, message: 'Inventory added successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};
const getAllInventory = async (req: Request, res: Response) => {
	try {
		const inventories = await InventoryModel.find();

		res.status(200).json({ success: true, data: inventories });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

const getAllInventoryAgainstStore = async (req: Request, res: Response) => {
	try {
		// Retrieve all recipes from the database
		const recipes = await InventoryModel.find();

		res.status(200).json({ success: true, data: recipes });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

const deleteInventory = async (req: Request, res: Response) => {
	try {
		const inventoryId = req.params.inventoryId; // Extract the inventory ID from the request parameters

		// Find the inventory record by ID and delete it
		await InventoryModel.findByIdAndDelete(inventoryId);

		res
			.status(200)
			.json({ success: true, message: 'Inventory deleted successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};
const updateStockQuantity = async (req: Request, res: Response) => {
	try {
		const { productId, newStockQuantity } = req.body;

		// Find the inventory record for the specified product ID
		const inventory = await InventoryModel.findOne({ product_id: productId });

		if (!inventory) {
			return res
				.status(404)
				.json({ success: false, message: 'Inventory not found' });
		}

		// Update the stock quantity
		inventory.qty = newStockQuantity;
		await inventory.save();

		res
			.status(200)
			.json({ success: true, message: 'Stock quantity updated successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

export {
	addInventory,
	getAllInventory,
	deleteInventory,
	updateStockQuantity,
	getAllInventoryAgainstStore,
};
