import express from 'express';
import verifyToken from '../middleware/verifyToken';
import {
	register,
	login,
	forgotPassword,
	tokenVerification,
	getSingleAdmin,
	getAllAdmins,
	updateAdmin,
	deleteAdmin,
	resetPassword,
	emailVerification,
} from '../controllers/adminController';
const router = express.Router();
import authenticateAdmin from '../middleware/authenticateAdmin';

router.post('/login', login);
router.post('/register', register);
router.post('/forgotPassword', forgotPassword);
router.post('/tokenVerification/:token', tokenVerification);
router.post('/resetPassword', resetPassword);
router.post('/emailVerification', emailVerification);

//protected route

router.get('/getAllAdmins', verifyToken, getAllAdmins);
router.get('/getSingleAdmin/:id', verifyToken, getSingleAdmin);
router.put('/updateAdmin/:id', verifyToken, updateAdmin);
router.delete('/deleteAdmin/:id', verifyToken, deleteAdmin);

export default router;
