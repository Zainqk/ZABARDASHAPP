import { Request, Response } from 'express';
import Order from '../models/orderModel';

const addOrder = async (req: Request, res: Response) => {
	try {
		const {
			customerId,
			martId,
			paymentStatus,
			paymentMethod,
			shippingAddress,
			subtotal,
			discounts,
			product,
			taxAmount,
			totalAmount,
			specialInstruction,
			cancellationReason,
		} = req.body;

		// Create a new order object
		const newOrder = new Order({
			customerId,
			martId,
			paymentStatus,
			paymentMethod,
			shippingAddress,
			subtotal,
			discounts,
			product,
			taxAmount,
			totalAmount,
			specialInstruction,
			cancellationReason,
		});

		// Save the new order to the database
		await newOrder.save();

		res
			.status(201)
			.json({ success: true, message: 'Order added successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};
// const addOrder = async (req: Request, res: Response) => {
// 	try {
// 		const {
// 			customerId,
// 			martId,
// 			paymentStatus,
// 			paymentMethod,
// 			shippingAddress,
// 			subtotal,
// 			discounts,
// 			product,
// 			taxAmount,
// 			totalAmount,
// 			specialInstruction,
// 			cancellationReason,
// 		} = req.body;

// 		// Create a new order object
// 		const newOrder = new Order({
// 			customerId,
// 			martId,
// 			paymentStatus,
// 			paymentMethod,
// 			shippingAddress,
// 			subtotal,
// 			discounts,
// 			product,
// 			taxAmount,
// 			totalAmount,
// 			specialInstruction,
// 			cancellationReason,
// 		});

// 		// Save the new order to the database
// 		await newOrder.save();

// 		res
// 			.status(201)
// 			.json({ success: true, message: 'Order added successfully' });
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).json({ success: false, message: 'Internal server error' });
// 	}
// };

export { addOrder };
