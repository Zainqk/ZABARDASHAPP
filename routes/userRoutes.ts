import express from 'express';
import {
	register,
	login,
	forgotPassword,
	tokenVerification,
	getSingleCustomer,
	getAllCustomer,
	updateCustomer,
	deleteCustomer,
	resetPassword,
	emailVerification,
} from '../controllers/userController';
const router = express.Router();
import authenticateAdmin from '../middleware/authenticateAdmin';

router.post('/login', login);
router.post('/register', register);
router.post('/forgotPassword', forgotPassword);
router.post('/tokenVerification/:token', tokenVerification);
router.post('/resetPassword', resetPassword);
router.post('/emailVerification', emailVerification);
router.get('/getAllCustomer', getAllCustomer);
router.get('/getSingleCustomer/:id', getSingleCustomer);

router.put('/updateCustomer/:id', updateCustomer);
router.delete('/deleteCustomer/:id', deleteCustomer);

export default router;
