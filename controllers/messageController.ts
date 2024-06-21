import { Request, Response } from 'express';
import InventoryModel from '../models/inventoryModel';
import MessageModel from '../models/messageModel';
import ConversationModel from '../models/conversationModel';

const getAllMessages = async (req: Request, res: Response) => {
	try {
		const Messages = await MessageModel.find();

		res.status(200).json({ success: true, Messages: Messages });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};
const createConversation = async (req: Request, res: Response) => {
	try {
		const { customer_id, vendor_id, order_id, order_supportiveId } = req.body;

		// Find the newMessage record for the specified product ID
		const conversation = new ConversationModel({
			customer_id,
			vendor_id,
			order_id,
			order_supportiveId,
		});

		// Save the new conversation to the database
		const newConversation = await conversation.save();

		res.status(200).json({
			success: true,
			conversation: newConversation,
			message: 'Conversation created successfully',
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};
const getConversation = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const conversation = await ConversationModel.find({ customer_id: id });

		res.status(200).json({
			success: true,
			conversation: conversation,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

const deleteMessage = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const result = await MessageModel.findByIdAndDelete(id);
		res
			.status(200)
			.json({ success: true, message: 'Message deleted successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};
const updateMessage = async (req: Request, res: Response) => {
	try {
		const { id, message } = req.body;

		// Find the newMessage record for the specified product ID
		const newMessage = await MessageModel.findById(id);

		if (!newMessage) {
			return res
				.status(404)
				.json({ success: false, message: 'Message not found' });
		}

		// Update the stock quantity
		newMessage.message = message;
		await newMessage.save();

		res
			.status(200)
			.json({ success: true, message: 'Message updated successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};
const getMessagesForCustomer = async (req: Request, res: Response) => {
	try {
		const { conversation_id } = req.query;

		// Find the newMessage record for the specified product ID
		const newMessages = await MessageModel.find({
			conversation_id,
		});

		if (!newMessages) {
			return res
				.status(404)
				.json({ success: false, message: 'Message not found' });
		}

		res.status(200).json({ success: true, messages: newMessages });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

const getMessagesForVendor = async (req: Request, res: Response) => {
	try {
		const { conversation_id } = req.query;

		// Find the newMessage record for the specified product ID
		const newMessages = await MessageModel.find({
			conversation_id,
		});

		if (!newMessages) {
			return res
				.status(404)
				.json({ success: false, message: 'Message not found' });
		}
		res.status(200).json({ success: true, messages: newMessages });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

export {
	getAllMessages,
	deleteMessage,
	updateMessage,
	getMessagesForVendor,
	getMessagesForCustomer,
	createConversation,
	getConversation,
};
