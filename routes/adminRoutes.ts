import express from 'express';
import {
	register,
	login,
	forgotPassword,
	tokenVerification,
	getSingleAdmin,
	getAllAdmins,
	updateAdmin,
	deleteAdmin,
} from '../controllers/adminController';
const router = express.Router();
import authenticateAdmin from '../middleware/authenticateAdmin';

router.post('/login', login);
router.post('/register', register);
router.post('/forgotPassword', forgotPassword);
router.post('/tokenVerification/:token', tokenVerification);
router.get('/getAllAdmins', getAllAdmins);
router.get('/getSingleAdmin/:id', getSingleAdmin);

router.put('/updateAdmin/:id', updateAdmin);
router.delete('/deleteAdmin/:id', deleteAdmin);

export default router;
