import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/index';
import connectDb from './db';
import path from 'path';
import cors from 'cors';
import { setupChatServer } from './chat/chatServer';
const app = express();
const PORT = process.env.PORT || 6000;

connectDb();

// Add CORS middleware
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'upload/images')));
app.use('/', routes);
const chatServer = setupChatServer(app);
chatServer.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
