import { Request, Response } from 'express';
import User, { UserInterface } from '../models/userModel';
import AddressModel from '../models/addressModel';
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
import UserModal from '../models/userModel';

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
	const { email, otp } = req.body;

	try {
		const result = await verifyOtp({
			otp,
			email,
		});
		if (result.success) {
			res.status(200).json(result);
			// const response = await registerCustomer({ userId });
			// if (response.success) {
			// 	res.status(200).json(response);
			// } else {
			// 	res.status(500).json(response);
			// }
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

//getAllVendor
const getAllVendor = async (req: Request, res: Response) => {
	try {
		const result = await User.find({ userType: 'vendor' }, { password: 0 });
		console.log('The result is:', result);

		res.status(200).json({
			success: true,
			Vendors: result,
		});
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

// const updateCustomer = async (req: Request, res: Response) => {
// 	try {
// 		const updateData = req.body;

// 		const result = await updateCustomers({ id: req.params.id, updateData });

// 		if (result.success) {
// 			res.status(200).json({
// 				success: true,
// 				Customer: result.customer,
// 				message: 'Customer updated successfully',
// 			});
// 		} else {
// 			res.status(500).json({
// 				success: false,
// 				message: result.message,
// 			});
// 		}
// 	} catch (err) {
// 		res.status(500).send(err);
// 	}
// };
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

const getToken = async (req: Request, res: Response) => {
	const { email } = req.body;
	try {
		const token = generateToken({ email: email });

		if (token) {
			res.status(200).json({ token: token });
		} else {
			res.status(500).json('No token against this email');
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

const addAddress = async (req: Request, res: Response) => {
	const { customer_id, title, address } = req.body;
	try {
		const newAddress = new AddressModel({ customer_id, title, address });
		await newAddress.save();
		res
			.status(201)
			.json({ message: 'Address added successfully', address: newAddress });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};
const getAddressesByCustomerId = async (req: Request, res: Response) => {
	const { customer_id } = req.params;
	try {
		const addresses = await AddressModel.find({ customer_id });
		if (addresses.length > 0) {
			res.status(200).json({ addresses });
		} else {
			res.status(404).json({ message: 'No addresses found for this customer' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

const socialLogin = async (req: Request, res: Response) => {
	const { name, email } = req.body;

	try {
		// Check if the user already exists
		const existingUser = await UserModal.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: 'User already exists',
			});
		}

		// Create a new user instance
		const newUser = new UserModal({
			password: 'ijklmnopqrstuvwxyzABCDEFGHIJK',
			name,
			email,
		});

		// Save the user to the database
		await newUser.save();

		// Generate a JWT token
		const token = jwt.sign(
			{ email: newUser.email },
			`${process.env.SECRETKEY}`,
			{ expiresIn: '1h' } // Token expires in 1 hour
		);

		// Return the user data and token
		const userResponse = {
			name: newUser.name,
			email: newUser.email,
			userType: newUser.userType,
			token: token,
		};
		// Return the user data and token
		res.status(201).json({
			success: true,
			message: 'User registered successfully',
			data: userResponse,
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
	getAllVendor,
	getToken,
	addAddress,
	getAddressesByCustomerId,
	socialLogin,
};
