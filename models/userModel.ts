import mongoose, { Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface UserInterface {
	name: string;
	email: string;
	phoneNumber: number;
	password: string;
	userType: string;
	address: string;
	comparePassword(candidatePassword: string): Promise<boolean>;
	generateToken(): string;
}

const userSchema = new Schema<UserInterface>({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	phoneNumber: {
		type: Number,
		// required: true,
		unique: true,
	},
	password: {
		type: String,
		// required: true,
	},
	userType: {
		type: String,
		required: true,
		default: 'customer',
	},
	address: {
		type: String,
	},
});

// Hash the password before saving to the database
userSchema.pre<UserInterface>('save', async function (next) {
	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error: any) {
		next(error);
	}
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (
	candidatePassword: string
) {
	try {
		return await bcrypt.compare(candidatePassword, this.password);
	} catch (error: any) {
		return false;
	}
};

const UserModal: Model<UserInterface> = mongoose.model('User', userSchema);

export { UserInterface };
export default UserModal;
