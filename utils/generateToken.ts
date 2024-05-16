import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
interface userInput {
	email: string;
}
const generateToken = ({ email }: userInput) => {
	const token = jwt.sign(
		{
			email: email,
		},
		`${process.env.SECRETKEY}`,
		{ expiresIn: '12h' } // Set the token expirations time as needed
	);

	return token;
};
export default generateToken;
