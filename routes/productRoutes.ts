import express from 'express';
import verifyToken from '../middleware/verifyToken';
import { addProduct } from '../controllers/productController';
import multer from 'multer';
const router = express.Router();

// protected route

router.post('/addproduct', verifyToken, addProduct);
// router.get('/getallmart', verifyToken, getAllMart);

export default router;
