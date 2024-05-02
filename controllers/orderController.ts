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

		// // If status is provided, add it to the query
		// if (status && typeof status === 'string') {
		// 	query.status = new RegExp(status, 'i');
		// }

		// Fetch orders based on the query
		const orders = await Order.find(query);

		res.status(200).json({ success: true, orders });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

const getAllOrders = async (req: Request, res: Response) => {
	try {
		const orders = await Order.find();

		res.status(200).json({ success: true, orders });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

const updateOrderStatus = async (req: Request, res: Response) => {
	try {
		const { orderId, newStatus } = req.body;

		// Find the order by orderId
		const existingOrder = await Order.findById(orderId);

		if (!existingOrder) {
			return res
				.status(404)
				.json({ success: false, message: 'Order not found' });
		}

		// Update the order status
		existingOrder.status = newStatus;

		// Save the updated order status to the database
		await existingOrder.save();

		res
			.status(200)
			.json({ success: true, message: 'Order status updated successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

const updateOrderStatuses = async (req: Request, res: Response) => {
	try {
		const { orderId, newStatus } = req.body;

		// Find the order by orderId
		const existingOrder = await Order.findById(orderId);

		if (!existingOrder) {
			return res
				.status(404)
				.json({ success: false, message: 'Order not found' });
		}

		// Update the order status
		existingOrder.status = newStatus;

		// Save the updated order status to the database
		await existingOrder.save();

		res
			.status(200)
			.json({ success: true, message: 'Order status updated successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

const deleteOrder = async (req: Request, res: Response) => {
	try {
		const orderId = req.params.id;

		// Find the order by orderId and delete it
		const deletedOrder = await Order.findByIdAndDelete(orderId);

		if (!deletedOrder) {
			return res
				.status(404)
				.json({ success: false, message: 'Order not found' });
		}

		res
			.status(200)
			.json({ success: true, message: 'Order deleted successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

export { addOrder, fetchOrders, getAllOrders, updateOrderStatus, deleteOrder };
