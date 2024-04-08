import express from 'express';
import verifyToken from '../middleware/verifyToken';
import {
	addProduct,
	getProductsByMartId,
	getAllProducts,
	addSavingProduct,
	getSavingProducts,
	getSavingProductsById,
	getMartsByProductName,
} from '../controllers/productController';
import multer from 'multer';
const router = express.Router();

// protected route

router.post('/addproduct', verifyToken, addProduct);
router.get('/getproductsbymartid', verifyToken, getProductsByMartId);
router.get('/getallproducts', verifyToken, getAllProducts);
router.post('/addsavingproduct', verifyToken, addSavingProduct);
router.get('/getsavingproducts', verifyToken, getSavingProducts);
router.get('/getsavingproductsbyid', verifyToken, getSavingProductsById);
router.get('/getMartsByProductName', verifyToken, getMartsByProductName);
export default router;
