import { Request, Response } from 'express';
import Mart, { MartInterface } from '../models/martModel';
import generateResetToken from '../utils/generateResetToken';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import generateToken from '../utils/generateToken';

//addMart
const addMart = async (req: Request, res: Response) => {
	try {
		const { name, address, vendor_id, img } = req.body;

		// Check if an image file was uploaded
		// let imagePath = '';
		// if (req.file) {
		// 	imagePath = req.file.path;
		// }

		// Create a new mart object
		const newMart = new Mart({
			name,
			address,
			img: img,
			vendor_id,
		});

		// Save the new mart to the database
		await newMart.save();

		res.status(201).json({ success: true, message: 'Mart added successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

const uploadPic = async (req: Request, res: Response) => {
	try {
		// Check if a file was uploaded
		if (!req.file) {
			return res
				.status(400)
				.json({ success: false, message: 'No image uploaded' });
		}

		// Get the file path
		const imgPath = req.file.path;

		res.status(200).json({ success: true, imagePath: imgPath });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

export { addMart, uploadPic };
