import mongoose, { Model, Schema, Document } from 'mongoose';
import { UserInterface } from './userModel';

interface MessageInterface extends Document {
	customer_id: mongoose.Types.ObjectId;
	vendor_id: mongoose.Types.ObjectId;
	admin_id: mongoose.Types.ObjectId;
	content: string;
	createdAt: Date;
	updatedAt: Date;
}

const messageSchema = new Schema<MessageInterface>(
	{
		customer_id: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		vendor_id: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		admin_id: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const MessageModel: Model<MessageInterface> = mongoose.model(
	'Message',
	messageSchema
);

export { MessageInterface };
export default MessageModel;
