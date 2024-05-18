import http from 'http';
import { Server } from 'socket.io';
import MessageModel from '../models/messageModel'; // Import your MessageModel

// Map to store user IDs and their corresponding socket instances
const userSockets = new Map();

export const setupChatServer = (app: any) => {
	const server = http.createServer(app);
	const io = new Server(server, {
		cors: {
			origin: '*', // Allow any domain
			methods: ['GET', 'POST'],
			credentials: true,
		},
	});

	io.on('connection', (socket) => {
		console.log('A user connected');

		// Event listener to associate user ID with socket instance
		socket.on('userId', (userId) => {
			console.log(`User ${userId} connected`);
			userSockets.set(userId, socket);
		});

		// Event listener for message
		socket.on('message', async (data) => {
			console.log('Received message from client:', data);
			const { message, senderId, recipientUserIds, isCustomer } = data;
			// console.log('The isCustomer value is:', isCustomer);
			const senderSocket = userSockets.get(senderId);

			let messageDocument, dbMessages;
			if (isCustomer) {
				messageDocument = new MessageModel({
					customer_id: senderId,
					vendor_id: recipientUserIds[0],
					message,
				});
				dbMessages = await MessageModel.find({ customer_id: senderId });
			} else {
				messageDocument = new MessageModel({
					customer_id: recipientUserIds[0],
					vendor_id: senderId,
					message,
				});
				dbMessages = await MessageModel.find({ vendor_id: senderId });
			}

			try {
				await messageDocument.save();
				// console.log('Message saved to database');
			} catch (error) {
				console.error('Error saving message to database:', error);
			}
			const senderMessagePayload = {
				messageDocument,
				sender: true,
			};
			const receiptMessagePayload = {
				messageDocument,
				receiver: true,
			};

			// Send the message back to the sender with sender: true
			if (senderSocket) {
				// senderSocket.emit('message', senderMessagePayload);
				senderSocket.emit('message', senderMessagePayload);
			}
			// Iterate over the array of recipient IDs and send the message to each
			recipientUserIds.forEach((recipientUserId: any) => {
				const recipientSocket = userSockets.get(recipientUserId);

				if (recipientSocket) {
					// If recipient is online, send the message only to that socket
					recipientSocket.emit('message', receiptMessagePayload);
				} else {
					console.log(`Recipient ${recipientUserId} is not online`);
					// Handle the case where the recipient is not online (optional)
				}
			});
		});

		// Event listener for disconnect
		socket.on('disconnect', () => {
			// Remove user ID from the map when socket disconnects
			userSockets.forEach((value, key) => {
				if (value === socket) {
					userSockets.delete(key);
					console.log(`User ${key} disconnected`);
				}
			});
		});
	});

	return server;
};
