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
	deleteProduct,
	editProduct,
	getSavingProductsByCategoryId,
} from '../controllers/productController';
import multer from 'multer';
const router = express.Router();

// protected route

router.post('/addproduct', verifyToken, addProduct);
router.get('/getproductsbymartid', verifyToken, getProductsByMartId);
router.get('/getallproducts', verifyToken, getAllProducts);
router.get('/getSavingProducts', verifyToken, getSavingProducts);
router.get('/getallproducts', verifyToken, getAllProducts);
router.put('/editproduct/:id', verifyToken, editProduct);
router.delete('/deleteproduct/:id', verifyToken, deleteProduct);
router.get('/getsavingproductsbyid', verifyToken, getSavingProductsById);
router.get(
	'/getSavingProductsByCategoryId',
	verifyToken,
	getSavingProductsByCategoryId
);
router.get('/getMartsByProductName', verifyToken, getMartsByProductName);
export default router;
