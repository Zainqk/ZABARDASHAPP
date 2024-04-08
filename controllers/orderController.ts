import { Request, Response } from 'express';
import Order from '../models/orderModel';
import mongoose from 'mongoose';
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
			isDelivery,
		} = req.body;

		const orderNumber = `#${Math.floor(1000000 + Math.random() * 9000000)}`;
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
			isDelivery,
			orderNumber,
		});

		// Save the new order to the database
		await newOrder.save();

		res.status(201).json({
			orderNumber: orderNumber,
			success: true,
			message: 'Order added successfully',
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};
const fetchOrders = async (req: Request, res: Response) => {
	try {
		const { status, user_id } = req.query;

		// Define the query object
		const query: { customerId: mongoose.Types.ObjectId; status?: RegExp } = {
			customerId: user_id as unknown as mongoose.Types.ObjectId, // Assuming user_id is a valid ObjectId
		};

		// If status is provided, add it to the query
		if (status && typeof status === 'string') {
			query.status = new RegExp(status, 'i');
		}

		// Fetch orders based on the query
		const orders = await Order.find(query);

		res.status(200).json({ success: true, orders });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

export { addOrder, fetchOrders };
