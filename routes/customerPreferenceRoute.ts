import express from 'express';
import verifyToken from '../middleware/verifyToken';
import { addMart, getAllMart } from '../controllers/martController';
const router = express.Router();

// protected routes

router.post('/addmart', verifyToken, addMart);
router.get('/getallmart', verifyToken, getAllMart);

export default router;
