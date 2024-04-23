import { Request, Response } from 'express';
import User, { UserInterface } from '../models/userModel';
import {
	createCustomer,
	loginCustomer,
	forgotPass,
	verifyForgotPassToken,
	resetPass,
	emailVerif,
	registerCustomer,
	getAllCustomers,
	getCustomerById,
	updateCustomers,
	deleteCustomers,
	verifyOtp,
} from '../services/userService';
import generateResetToken from '../utils/generateResetToken';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import generateToken from '../utils/generateToken';

// Register Admin api
const register = async (req: Request, res: Response) => {
	const { name, email, password, userType, phoneNumber } = req.body;

	try {
		const result = await createCustomer({
			name,
			email,
			password,
			userType,
			phoneNumber,
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
// email verification API
const emailVerification = async (req: Request, res: Response) => {
	const { userId, token } = req.body;

	try {
		const result = await emailVerif({
			token,
		});
		if (result.success) {
			const response = await registerCustomer({ userId });
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
const otpVerification = async (req: Request, res: Response) => {
	const { userId, otp } = req.body;

	try {
		const result = await verifyOtp({
			otp,
			userId,
		});
		if (result.success) {
			const response = await registerCustomer({ userId });
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
		const result = await loginCustomer({
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
// const login = async (req: Request, res: Response) => {
// 	const { email, password } = req.body;
// 	try {
// 		const result = await loginCustomer({
// 			email,
// 			password,
// 		});

// 		if (result.success) {
// 			res.status(200).json(result);
// 		} else {
// 			res.status(500).json(result);
// 		}
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({ message: 'Internal server error' });
// 	}
// };

// Forgot  sPassword
const forgotPassword = async (req: Request, res: Response) => {
	const { email } = req.body;

	try {
		// Check if customer with the provided email exists
		const customer = await User.findOne({ email });

		if (!customer) {
			return res.status(404).json({ message: 'Customer not found' });
		}

		const result = await forgotPass({
			email,
		});

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

//getAllCustomer
const getAllCustomer = async (req: Request, res: Response) => {
	try {
		const result = await getAllCustomers();

		if (result.success) {
			res.status(200).json({
				success: true,
				Customer: result.customers,
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
const getSingleCustomer = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const result = await getCustomerById({ id });

		if (result.success) {
			res.status(200).json({
				success: true,
				Admin: result.customers,
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

// updateCustomer
const updateCustomer = async (req: Request, res: Response) => {
	try {
		const updateData = req.body;

		const result = await updateCustomers({ id: req.params.id, updateData });

		if (result.success) {
			res.status(200).json({
				success: true,
				Customer: result.customer,
				message: 'Customer updated successfully',
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
const deleteCustomer = async (req: Request, res: Response) => {
	try {
		const result = await deleteCustomers({ id: req.params.id });

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
	getSingleCustomer,
	getAllCustomer,
	updateCustomer,
	deleteCustomer,
	resetPassword,
	emailVerification,
	otpVerification,
};
