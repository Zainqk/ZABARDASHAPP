import express from 'express';
import verifyToken from '../middleware/verifyToken';
import {
	addOrder,
	fetchOrders,
	getAllOrders,
	updateOrderStatus,
	deleteOrder,
} from '../controllers/orderController';
const router = express.Router();

// protected route

router.post('/addorder', verifyToken, addOrder);
router.get('/fetchOrders', verifyToken, fetchOrders);
router.get('/getAllOrders', verifyToken, getAllOrders);
router.post('/updateStatus', verifyToken, updateOrderStatus);
router.get('/getAllOrders', verifyToken, getAllOrders);
router.delete('/deleteOrder/:id', verifyToken, deleteOrder);

export default router;
