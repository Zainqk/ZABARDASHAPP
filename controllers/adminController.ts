import { Request, Response } from 'express';
import Admin, { AdminInterface } from '../models/adminModel';
import {
	createAdmin,
	loginAdmin,
	forgotPass,
	verifyForgotPassToken,
} from '../services/adminServices';
import generateResetToken from '../utils/generateResetToken';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import generateToken from '../utils/generateToken';

// Register Admin api
const register = async (req: Request, res: Response) => {
	const { username, email, password } = req.body;

	try {
		const result = await createAdmin({
			username,
			email,
			password,
		});

		if (result.success) {
			res.status(200).json(result);
		} else {
			res.status(500).json(result);
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

// Login Admin api
const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	try {
		const result = await loginAdmin({
			email,
			password,
		});

		if (result.success) {
			res.status(200).json(result);
		} else {
			res.status(500).json(result);
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

// getSingleAdmin
const getSingleAdmin = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const user = await Admin.findById(id);

		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'Admin not found',
			});
		}

		res.status(200).json({
			success: true,
			user,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

// Forgot  sPassword
const forgotPassword = async (req: Request, res: Response) => {
	const { email } = req.body;

	try {
		// Check if admin with the provided email exists
		const admin = await Admin.findOne({ email });

		if (!admin) {
			return res.status(404).json({ message: 'Admin not found' });
		}

		const result = await forgotPass({
			email,
		});

		console.log('The response of email sending is:', result);

		if (result?.success) {
			res.status(200).json(result);
		} else {
			res.status(500).json(result);
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

// Reset Password (Verify token)
const tokenVerification = async (req: Request, res: Response) => {
	const { token } = req.params;
	try {
		const result = await verifyForgotPassToken({
			token,
		});

		if (result) {
			if (result.success) {
				res.status(200).json(result);
			} else {
				res.status(500).json(result);
			}
		} else {
			// Handle case where result is undefined
			res.status(500).json({
				success: false,
				message: 'Error occurred while verifying token',
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

//getAllAdmins
const getAllAdmins = async (req: Request, res: Response) => {
	try {
		const users = await Admin.find();

		res.status(200).json({
			success: true,
			users,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

// updateAdmin
const updateAdmin = async (req: Request, res: Response) => {
	try {
		const updateData = req.body;
		const records = await Admin.findByIdAndUpdate(req.params.id, updateData, {
			new: true,
		});

		if (!records) {
			res.status(404).json({
				success: false,
				message: 'Record not found',
			});
		} else {
			res.status(200).json({
				success: true,
				message: 'Admin updated successfully',
			});
		}
	} catch (err) {
		res.status(500).send(err);
	}
};

// deleteAdmin
const deleteAdmin = async (req: Request, res: Response) => {
	try {
		const records = await Admin.findByIdAndDelete(req.params.id);
		if (!records) {
			res.status(404).json({
				success: false,
				message: 'Record not found',
			});
		} else {
			res.status(200).json({
				success: true,
				message: 'Admin deleted successfully',
			});
		}
	} catch (err) {
		res.status(500).send(err);
	}
};

export {
	register,
	login,
	forgotPassword,
	tokenVerification,
	getSingleAdmin,
	getAllAdmins,
	updateAdmin,
	deleteAdmin,
};
