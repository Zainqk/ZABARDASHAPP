import mongoose, { Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface AdminInterface {
	username: string;
	email: string;
	password: string;
	comparePassword(candidatePassword: string): Promise<boolean>;
	generateToken(): string;
}

const adminSchema = new Schema<AdminInterface>({
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
});

// Hash the password before saving to the database
adminSchema.pre<AdminInterface>('save', async function (next) {
	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error: any) {
		next(error);
	}
});

// Method to compare passwords
adminSchema.methods.comparePassword = async function (
	candidatePassword: string
) {
	try {
		return await bcrypt.compare(candidatePassword, this.password);
	} catch (error: any) {
		return false;
	}
};

const AdminModal: Model<AdminInterface> = mongoose.model('Admin', adminSchema);

export { AdminInterface };
export default AdminModal;
