import express from 'express';
import verifyToken from '../middleware/verifyToken';
import {
	getAllMessages,
	deleteMessage,
	updateMessage,
	getMessagesForVendor,
	getMessagesForCustomer,
} from '../controllers/messageController';
import multer from 'multer';
const router = express.Router();

router.get('/getMessagesForVendor', verifyToken, getMessagesForCustomer);
router.get('/getMessagesForCustomer', verifyToken, getMessagesForVendor);
router.delete('/deleteMessage/:id', verifyToken, deleteMessage);
router.put('/update', verifyToken, updateMessage);
router.get('/getAllMessages', verifyToken, getAllMessages);

export default router;
