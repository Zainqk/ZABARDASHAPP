import express from 'express';
import verifyToken from '../middleware/verifyToken';
import {
	addOrder,
	fetchOrders,
	getAllOrders,
	updateOrderStatus,
	deleteOrder,
	overviewSale,
	saleAnalytics,
	getDeliveryCharges,
} from '../controllers/orderController';
const router = express.Router();

// protected route

router.post('/addorder', verifyToken, addOrder);
router.get('/fetchOrders', verifyToken, fetchOrders);
router.get('/overviewSale', verifyToken, overviewSale);
router.get('/saleAnalytics', verifyToken, saleAnalytics);
router.get('/getAllOrders', verifyToken, getAllOrders);
router.get('/getDeliveryFee', verifyToken, getDeliveryCharges);
router.post('/updateStatus', verifyToken, updateOrderStatus);
router.get('/getAllOrders', verifyToken, getAllOrders);
router.delete('/deleteOrder/:id', verifyToken, deleteOrder);

export default router;
