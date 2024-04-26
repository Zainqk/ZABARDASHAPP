import express from 'express';
import verifyToken from '../middleware/verifyToken';
import {
	addMart,
	uploadPic,
	getAllMart,
	addMartRating,
	addMartCustomerFavourite,
	getCustomerFavoriteMart,
} from '../controllers/martController';
import multer from 'multer';
const router = express.Router();

// Define storage for uploaded files
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'upload/images'); // Directory where uploaded files will be stored
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname); // Filename to save with timestamp
	},
});

// Initialize multer upload middleware
const upload = multer({
	storage: storage,
	limits: {
		fileSize: 10 * 1024 * 1024, // 10MB in bytes
	},
});

// // Define storage for uploaded files
// const storage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 		cb(null, 'upload/images'); // Directory where uploaded files will be stored
// 	},
// 	filename: function (req, file, cb) {
// 		cb(null, Date.now() + '-' + file.originalname); // Filename to save with timestamp
// 	},
// });

// // Initialize multer upload middleware
// const upload = multer({
// 	storage: storage,
// 	limits: {
// 		fileSize: 10 * 1024 * 1024, // 10MB in bytes
// 	},
// });

// protected routes

router.post('/addmart', verifyToken, addMart);
router.post('/uploadpic', verifyToken, upload.single('image'), uploadPic);
router.get('/getallmart', verifyToken, getAllMart);
router.get('/getcustomerfavouritemart', verifyToken, getCustomerFavoriteMart);
router.post('/addmartrating', verifyToken, addMartRating);
router.post('/addmartcustomerfavourite', verifyToken, addMartCustomerFavourite);

export default router;
