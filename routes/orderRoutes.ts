import express from 'express';
import verifyToken from '../middleware/verifyToken';
import { addOrder } from '../controllers/orderController';
const router = express.Router();

// protected route

router.post('/addorder', verifyToken, addOrder);

export default router;
