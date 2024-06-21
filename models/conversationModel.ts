import mongoose, { Model, Schema, Document } from 'mongoose';
import { MessageInterface } from './messageModel';
import { UserInterface } from './userModel';

interface ConversationInterface extends Document {
	customer_id: mongoose.Types.ObjectId;
	vendor_id: mongoose.Types.ObjectId;
	order_id: mongoose.Types.ObjectId;
	order_supportiveId: string;
}

const conversationSchema = new Schema<ConversationInterface>(
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
		order_id: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		order_supportiveId: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const ConversationModel: Model<ConversationInterface> = mongoose.model(
	'Conversation',
	conversationSchema
);

export { ConversationInterface };
export default ConversationModel;
