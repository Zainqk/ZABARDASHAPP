import AdminModal, { AdminInterface } from '../models/adminModel';
import generateToken from '../utils/generateToken';
import generateResetToken from '../utils/generateResetToken';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import NodeCache from 'node-cache';

const tempStorage = new NodeCache();

interface createAdminInterface {
	username: string;
	email: string;
	password: string;
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
	uuid: string;
}

const createAdmin = async ({
	username,
	email,
	password,
}: createAdminInterface) => {
	try {
		// Check if admin with the given email already exists
		const existingAdmin = await AdminModal.findOne({ email });

		if (existingAdmin) {
			return {
				success: false,
				message: 'Admin already exists with the same email',
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
		// Store the user information in temporary storage with userId as key
		tempStorage.set(userId, { username, email, password });

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

const registerAdmin = async ({ uuid }: registerAdminInterface) => {
	try {
		// Retrieve user information from temporary storage using userId
		const userData = tempStorage.get(uuid) as {
			username: string;
			email: string;
			password: string;
		};

		console.log('It give me this the Userdata:', userData);

		if (!userData) {
			return { success: false, message: 'User information not found' };
		}
		const newAdmin = await AdminModal.create({
			username: userData.username,
			email: userData.email,
			password: userData.password,
		});

		tempStorage.del(uuid);

		return { success: true, message: 'Admin Register successfully' };
	} catch (error) {
		console.error(error);
		return { success: false, message: 'Login internal server error' };
	}
};

const loginAdmin = async ({ email, password }: loginAdminInterface) => {
	try {
		const admin = await AdminModal.findOne({ email });

		if (!admin) {
			// Admin not found
			return { success: false, message: 'Admin not found' };
		}

		const isPasswordValid = await admin.comparePassword(password);

		if (!isPasswordValid) {
			// Invalid password
			return { success: false, message: 'Invalid password' };
		}

		const token = generateToken({ email: admin.email });

		return { success: true, admin: { email: admin.email, token } };
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
		const adminUser = await AdminModal.findOne({ email });

		if (!adminUser) {
			return { success: false, message: 'Admin not found' };
		}

		adminUser.password = password;
		await adminUser.save();

		return { success: true, message: 'Password reset successfully' };
	} catch (error) {
		console.error(error);
		return { success: false, message: 'Reset pass internal server error' };
	}
};

export {
	createAdmin,
	loginAdmin,
	forgotPass,
	verifyForgotPassToken,
	resetPass,
	emailVerif,
	registerAdmin,
};
