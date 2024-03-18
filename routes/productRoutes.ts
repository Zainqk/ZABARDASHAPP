import express from 'express';
import verifyToken from '../middleware/verifyToken';
import {
	addProduct,
	getProductsByMartId,
} from '../controllers/productController';
import multer from 'multer';
const router = express.Router();

// protected route

router.post('/addproduct', verifyToken, addProduct);
router.get('/getproductsbymartid/:mart_id', verifyToken, getProductsByMartId);

export default router;
