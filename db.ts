import mongoose from 'mongoose';
require('dotenv').config();
const connectDb = async () => {
	try {
		// commmen added
		await mongoose.connect(
			// `mongodb+srv://user:${process.env.DB_PASSWORD}@cluster0.ybutdar.mongodb.net/`,
			`mongodb://user:${process.env.DB_PASSWORD}@ac-z7fi0ff-shard-00-00.ybutdar.mongodb.net:27017,ac-z7fi0ff-shard-00-01.ybutdar.mongodb.net:27017,ac-z7fi0ff-shard-00-02.ybutdar.mongodb.net:27017/?replicaSet=atlas-108xga-shard-0&ssl=true&authSource=admin`,

			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			} as Parameters<typeof mongoose.connect>[1]
		);
		console.log('MongoDb is connected');
	} catch (error: any) {
		console.log(error.message);
	}
};

export default connectDb;
