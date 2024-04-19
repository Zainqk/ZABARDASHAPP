import { Request, Response } from 'express';
import Admin, { AdminInterface } from '../models/adminModel';
import {
	createAdmin,
	loginAdmin,
	forgotPass,
	verifyForgotPassToken,
	resetPass,
	emailVerif,
	registerAdmin,
	getAllAdmin,
	getAdminById,
	updateAdmins,
	deleteAdmins,
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

const emailVerification = async (req: Request, res: Response) => {
	const { userId, token } = req.body;

	try {
		const result = await emailVerif({
			token,
		});
		if (result.success) {
			const response = await registerAdmin({ userId });
			if (response.success) {
				res.status(200).json(response);
			} else {
				res.status(500).json(response);
			}
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

// Verify token
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

// reset password
const resetPassword = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	try {
		const result = await resetPass({
			email,
			password,
		});
		if (result.success) {
			res.status(200).json(result);
		} else {
			res.status(500).json(result);
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
		const result = await getAllAdmin();

		if (result.success) {
			res.status(200).json({
				success: true,
				Admin: result.admins,
			});
		} else {
			res.status(500).json({
				success: false,
				message: result.message,
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

// getSingleAdmin
const getSingleAdmin = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const result = await getAdminById({ id });

		if (result.success) {
			res.status(200).json({
				success: true,
				Admin: result.admins,
			});
		} else {
			res.status(500).json({
				success: false,
				message: result.message,
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}
};

// const getSingleAdmin = async (req: Request, res: Response) => {
// 	const { id } = req.params;

// 	try {
// 		const result = await getAdminById({ id });

// 		if (result.success) {
// 			res.status(200).json({
// 				success: true,
// 				Admin: result.admins,
// 			});
// 		} else {
// 			res.status(500).json({
// 				success: false,
// 				message: result.message,
// 			});
// 		}
// 	} catch (error) {
// 		res.status(500).json({
// 			success: false,
// 			message: 'Internal server error',
// 		});
// 	}
// };
// updateAdmin
const updateAdmin = async (req: Request, res: Response) => {
	try {
		const updateData = req.body;

		const result = await updateAdmins({ id: req.params.id, updateData });

		if (result.success) {
			res.status(200).json({
				success: true,
				Admin: result.admin,
				message: 'Admin updated successfully',
			});
		} else {
			res.status(500).json({
				success: false,
				message: result.message,
			});
		}
	} catch (err) {
		res.status(500).send(err);
	}
};

// deleteAdmin
const deleteAdmin = async (req: Request, res: Response) => {
	try {
		const result = await deleteAdmins({ id: req.params.id });

		if (!result.success) {
			return res.status(404).json({
				success: false,
				message: result.message,
			});
		}

		res.status(200).json({
			success: true,
			message: result.message,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
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
	resetPassword,
	emailVerification,
};
