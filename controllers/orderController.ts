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

const overviewSale = async (req: Request, res: Response) => {
	try {
		const { mart_id } = req.query;
		// @ts-ignore

		const martId = new mongoose.Types.ObjectId(mart_id);
		// Calculate the total amount for orders with the specific mart_id and status "completed"
		const totalAmount = await Order.aggregate([
			{ $match: { martId: martId, status: 'completed' } },
			{ $group: { _id: null, amount: { $sum: '$totalAmount' } } },
		]);
		const pendingOrders = await Order.countDocuments({
			martId: mart_id,
			status: 'pending',
		});
		// Extract the total amount from the aggregation result
		const total = totalAmount.length > 0 ? totalAmount[0].amount : 0;

		res.status(200).json({
			success: true,
			totalSale: total,
			totalPendingOrder: pendingOrders,
			totalRevenue: 0,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

const saleAnalytics = async (req: Request, res: Response) => {
	try {
		const { mart_id } = req.query;

		// Parse mart_id into ObjectId
		// @ts-ignore
		const martId = new mongoose.Types.ObjectId(mart_id);

		// Aggregate orders by month and year
		const salesAnalytics = await Order.aggregate([
			{
				$match: {
					martId: martId,
					status: 'completed',
				},
			},
			{
				$group: {
					_id: {
						year: { $year: '$createdAt' },
						month: { $month: '$createdAt' },
					},
					totalAmount: { $sum: '$totalAmount' },
					orderCount: { $sum: 1 }, // Count the number of orders
				},
			},
			{
				$sort: {
					'_id.year': 1,
					'_id.month': 1,
				},
			},
		]);

		res.status(200).json({
			success: true,
			salesAnalytics: salesAnalytics,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

const fetchOrders1 = async (req: Request, res: Response) => {
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
const getAllOrders1 = async (req: Request, res: Response) => {
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

export {
	addOrder,
	fetchOrders,
	getAllOrders,
	updateOrderStatus,
	deleteOrder,
	overviewSale,
	saleAnalytics,
};
