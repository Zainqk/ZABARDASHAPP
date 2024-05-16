import express from 'express';
import verifyToken from '../middleware/verifyToken';
import {
	addMart,
	uploadPic,
	getAllMart,
	addMartRating,
	addMartCustomerFavourite,
	getCustomerFavoriteMart,
	updateMart,
} from '../controllers/martController';
import multer from 'multer';
const router = express.Router();

router.get('/getMessagesByCustomerId/:id', verifyToken, getAllMart);
router.get('/getMessagesByVendorId/:id', verifyToken, getAllMart);
router.delete('/deleteMessage/:id', verifyToken, getAllMart);
router.put('/update/:id', verifyToken, getAllMart);

export default router;
