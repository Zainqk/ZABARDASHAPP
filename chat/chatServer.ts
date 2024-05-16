import http from 'http';
import { Server } from 'socket.io';

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
		socket.on('message', (data) => {
			console.log('Received message from client:', data);
			const { message, senderId, recipientUserIds } = data;
			const senderSocket = userSockets.get(senderId);

			const senderMessagePayload = {
				message,
				sender: true,
			};
			const receiptMessagePayload = {
				message,
				receiver: true,
				senderId: senderId,
			};

			senderSocket.emit('message', senderMessagePayload);
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
