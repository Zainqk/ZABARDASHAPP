import { Request, Response } from 'express';
import InventoryModel from '../models/inventoryModel';
import CustomerPreferenceModel from '../models/customerPreferencesModel';
import path from 'path';
//addPreference
const addPreference = async (req: Request, res: Response) => {
	try {
		const { customerId, categoryPreferences, price, martId } = req.body;

		const newPreference = new CustomerPreferenceModel({
			customerId,
			categoryPreferences,
			price,
			martId,
		});

		await newPreference.save();

		res
			.status(201)
			.json({ success: true, message: 'Preference added successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};
const getPreferences = async (req: Request, res: Response) => {
	try {
		// Fetch all preferences from the database
		const preferences = await CustomerPreferenceModel.find({});

		res.status(200).json({ success: true, preferences });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};
const getPreferencesByMartId = async (req: Request, res: Response) => {
	try {
		const { martId } = req.query;

		// Fetch preferences based on the provided martId
		const preferences = await CustomerPreferenceModel.find({ martId });

		res.status(200).json({ success: true, preferences });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

export { addPreference, getPreferences, getPreferencesByMartId };
