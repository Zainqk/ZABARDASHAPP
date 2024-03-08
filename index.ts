import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/index';
import connectDb from './db';

const app = express();
const PORT = process.env.PORT || 6000;

connectDb();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', routes);

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
