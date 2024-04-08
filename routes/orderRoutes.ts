import express from 'express';
import verifyToken from '../middleware/verifyToken';
import { addOrder, fetchOrders } from '../controllers/orderController';
const router = express.Router();

// protected route

router.post('/addorder', verifyToken, addOrder);
router.get('/fetchOrders', verifyToken, fetchOrders);

export default router;
