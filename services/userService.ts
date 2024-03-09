import UserModal, { UserInterface } from '../models/userModel';
import generateToken from '../utils/generateToken';
import generateResetToken from '../utils/generateResetToken';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import NodeCache from 'node-cache';
const fs = require('fs');
const path = require('path');
const configFilePath = path.join(__dirname, '../config/config.json');
const tempStorage = new NodeCache();

interface createCustomerInterface {
	username: string;
	email: string;
	password: string;
	userType: string;
}
interface loginAdminInterface {
	email: string;
	password: string;
}
interface forgotPassInterface {
	email: string;
}
interface verifyForgotPassTokenInterface {
	token: string;
}
interface VerifyTokenResult {
	success: boolean;
	message: string;
}
interface resetPassInterface {
	email: string;
	password: string;
}
interface emailVerifInterface {
	token: string;
}
interface registerAdminInterface {
	userId: string;
}
interface getCustomerByIdInterface {
	id: string;
}
interface deleteCustomerInterface {
	id: string;
}
const createCustomer = async ({
	username,
	email,
	password,
	userType,
}: createCustomerInterface) => {
	try {
		// Check if admin with the given email already exists
		const existingCustomer = await UserModal.findOne({ email });

		if (existingCustomer) {
			return {
				success: false,
				message: 'Customer already exists with the same email',
			};
		}

		// Generate a reset token
		const resetToken = await generateResetToken({ email });
		// Create a transporter for sending emails
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'mabbask440@gmail.com',
				pass: `${process.env.APP_PASSWORD}`,
			},
		});

		// Compose the email
		const mailOptions = {
			from: `${process.env.FROM}`,
			to: email,
			subject: 'Email Verification',
			text: `Click the following link to reset your password: http://localhost:4000/verifcation/${resetToken}`,
		};

		// Send the email
		const info = await transporter.sendMail(mailOptions);

		console.log('Email sent: ' + info.response);

		// Generate a unique identifier for the user
		const userId = uuidv4();

		// Read existing data from config.json or initialize an empty array
		let userDataArray = [];
		if (fs.existsSync(configFilePath)) {
			const configData = fs.readFileSync(configFilePath);
			// Check if configData is not empty
			console.log('The user data is: ', configData);
			if (configData) {
				userDataArray = JSON.parse(configData);
			}
		}

		// Add user information to the array
		userDataArray.push({ userId, username, email, password, userType });

		// Write the updated user information back to config.json
		fs.writeFileSync(configFilePath, JSON.stringify(userDataArray, null, 2));

		return {
			success: true,
			userId,
			message: 'Check your Gmail for email verification',
		};
	} catch (error) {
		console.error(error);
		return {
			success: false,
			message: 'Admin registration internal server error',
		};
	}
};

const emailVerif = ({
	token,
}: emailVerifInterface): Promise<VerifyTokenResult> => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, `${process.env.SECRETKEY}`, (err) => {
			if (err) {
				reject({ success: false });
			} else {
				resolve({ success: true, message: 'Email verified' });
			}
		});
	});
};

const registerCustomer = async ({ userId }: registerAdminInterface) => {
	try {
		// Read user data from config.json
		const configData = fs.readFileSync(configFilePath);
		const userDataArray = JSON.parse(configData);

		// Find user information by userId
		const userData = userDataArray.find((user: any) => user.userId === userId);

		if (!userData) {
			return { success: false, message: 'Invalid data in config.json' };
		}
		// console.log('The admin registration data in the config.json:', userData);

		const existingAdmin = await UserModal.findOne({ email: userData.email });

		if (existingAdmin) {
			return {
				success: false,
				message: 'Customer already register',
			};
		}

		const registerCustomer = await UserModal.create({
			username: userData.username,
			email: userData.email,
			password: userData.password,
			userType: userData.userType,
		});

		// Remove the registered admin from adminDataArray
		let adminDataArray = userDataArray.filter(
			(user: any) => user.userId !== userId
		);

		// Write the updated adminDataArray back to config.json
		fs.writeFileSync(configFilePath, JSON.stringify(adminDataArray, null, 2));

		return {
			success: true,
			message: 'Customer Register successfully',
			registerCustomer,
		};
	} catch (error) {
		console.error(error);
		return { success: false, message: 'Registration internal server error' };
	}
};

const loginCustomer = async ({ email, password }: loginAdminInterface) => {
	try {
		const customer = await UserModal.findOne({ email });

		if (!customer) {
			// Admin not found
			return { success: false, message: 'Customer not found' };
		}

		const isPasswordValid = await customer.comparePassword(password);

		if (!isPasswordValid) {
			// Invalid password
			return { success: false, message: 'Invalid password' };
		}

		const token = generateToken({ email: customer.email });

		return { success: true, customer: { email: customer.email, token } };
	} catch (error) {
		console.error(error);
		return { success: false, message: 'Login internal server error' };
	}
};
const forgotPass = async ({ email }: forgotPassInterface) => {
	try {
		// Generate a reset token
		const resetToken = await generateResetToken({ email });

		if (!resetToken) {
			return { success: false, message: 'Error generating reset token' };
		}

		// Create a transporter for sending emails
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'mabbask440@gmail.com',
				pass: `${process.env.APP_PASSWORD}`,
			},
		});

		// Compose the email
		const mailOptions = {
			from: `${process.env.FROM}`,
			to: email,
			subject: 'Password Reset',
			text: `Click the following link to reset your password: http://localhost:4000/reset-password/${resetToken}`,
		};

		// Send the email
		const info = await transporter.sendMail(mailOptions);

		console.log('Email sent: ' + info.response);

		return { success: true, message: 'Reset link sent to your email' };
	} catch (error) {
		console.error(error);
		return { success: false, message: 'Forgot pass internal server error' };
	}
};

const verifyForgotPassToken = ({
	token,
}: verifyForgotPassTokenInterface): Promise<VerifyTokenResult> => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, `${process.env.SECRETKEY}`, (err) => {
			if (err) {
				reject({ success: false, message: 'Invalid or expired token' });
			} else {
				resolve({ success: true, message: 'Token verified successfully' });
			}
		});
	});
};

const resetPass = async ({ email, password }: resetPassInterface) => {
	try {
		const customer = await UserModal.findOne({ email });

		if (!customer) {
			return { success: false, message: 'Customer not found' };
		}

		customer.password = password;
		await customer.save();

		return { success: true, message: 'Password reset successfully' };
	} catch (error) {
		console.error(error);
		return { success: false, message: 'Reset pass internal server error' };
	}
};
interface updateCustomerInterface {
	id: string;
	updateData: any;
}
const getAllCustomers = async () => {
	try {
		// Retrieve all admins from the database
		const customers = await UserModal.find({}, { password: 0 });

		return { success: true, customers };
	} catch (error) {
		console.error(error);
		return { success: false, message: 'Internal server error' };
	}
};
const getCustomerById = async ({ id }: getCustomerByIdInterface) => {
	try {
		// Retrieve all customers from the database
		const customers = await UserModal.findById(id, { password: 0 });

		return { success: true, customers };
	} catch (error) {
		console.error(error);
		return { success: false, message: 'Internal server error' };
	}
};

const updateCustomers = async ({ id, updateData }: updateCustomerInterface) => {
	try {
		const { email } = updateData;

		// Check if the new email already exists in the database
		const existingAdmin = await UserModal.findOne({ email });

		if (existingAdmin && existingAdmin._id.toString() !== id) {
			return {
				success: false,
				message: 'Customer already exists with this email',
			};
		}
		// Find the admin by ID and update its data
		const updatedCustomer = await UserModal.findByIdAndUpdate(id, updateData, {
			new: true,
		});

		if (!updatedCustomer) {
			return { success: false, message: 'Admin not found' };
		}

		return { success: true, customer: updatedCustomer };
	} catch (error) {
		console.error(error);
		return { success: false, message: 'Internal server error' };
	}
};
const deleteCustomers = async ({ id }: deleteCustomerInterface) => {
	try {
		// Find the admin by ID and delete it
		const deletedCustomer = await UserModal.findByIdAndDelete(id);

		if (!deletedCustomer) {
			return { success: false, message: 'Customer not found' };
		}

		return { success: true, message: 'Customer deleted successfully' };
	} catch (error) {
		console.error(error);
		return { success: false, message: 'Internal server error' };
	}
};

export {
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
};
