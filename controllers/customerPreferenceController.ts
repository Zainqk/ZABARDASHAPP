import { Request, Response } from 'express';
import InventoryModel from '../models/inventoryModel';
// import CustomerPreferencesModel from '../models/customerPreferences';
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

const getAllInventory1 = async (req: Request, res: Response) => {
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
		const { id } = req.params;

		// Retrieve all inventory from the database

		const inventory = await InventoryModel.find({ vendor_id: id });

		res.status(200).json({ success: true, data: inventory });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

const getAllInventoryAgainstStore1 = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		// Retrieve all inventory from the database

		const inventory = await InventoryModel.find({ vendor_id: id });

		res.status(200).json({ success: true, data: inventory });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

const deleteInventory = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		// Check if the inventory item exists
		const inventoryItem = await InventoryModel.findById(id);
		if (!inventoryItem) {
			return res
				.status(404)
				.json({ success: false, message: 'Inventory item not found' });
		}
		const result = await InventoryModel.findByIdAndDelete(id);
		console.log('The result is:', result);
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
