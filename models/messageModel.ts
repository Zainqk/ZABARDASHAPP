import mongoose, { Model, Schema, Document } from 'mongoose';
import { UserInterface } from './userModel';

interface MessageInterface extends Document {
	conversation_id: mongoose.Types.ObjectId;
	// admin_id: mongoose.Types.ObjectId;
	message: string;
	createdAt: Date;
	updatedAt: Date;
}
// message model body
const messageSchema = new Schema<MessageInterface>(
	{
		conversation_id: {
			type: Schema.Types.ObjectId,
			ref: 'Conversation',
			required: true,
		},
		// admin_id: {
		// 	type: Schema.Types.ObjectId,
		// 	ref: 'User',
		// 	required: true,
		// },
		message: {
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
