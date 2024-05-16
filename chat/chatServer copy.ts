import http from 'http';
import { Server } from 'socket.io';

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

		// Event listener for message from user
		// socket.on('message', (message) => {
		// 	console.log('Received message from client:', message);

		// Broadcast the message to all connected user except the sender
		// socket.broadcast.emit('message', message);

		// Broadcast the message to all connected user
		// 	io.emit('message', message);
		// });

		socket.on('message', (data) => {
			console.log('Received message from client:', data);
			const { message, recipientUserId } = data;

			// Emit message only to the recipient user
			io.to(recipientUserId).emit('message', message);
		});

		// Event listener for disconnect
		socket.on('disconnect', () => {
			console.log('A user disconnected');
		});
	});

	return server;
};
