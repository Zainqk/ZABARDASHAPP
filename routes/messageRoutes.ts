import express from 'express';
import verifyToken from '../middleware/verifyToken';
import {
	getAllMessages,
	deleteMessage,
	updateMessage,
	getMessagesByVendorId,
	getMessagesByCustomerId,
} from '../controllers/messageController';
import multer from 'multer';
const router = express.Router();

router.get(
	'/getMessagesByCustomerId/:id',
	verifyToken,
	getMessagesByCustomerId
);
router.get('/getMessagesByVendorId/:id', verifyToken, getMessagesByVendorId);
router.delete('/deleteMessage/:id', verifyToken, deleteMessage);
router.put('/update', verifyToken, updateMessage);
router.get('/getAllMessages', verifyToken, getAllMessages);

export default router;
