import express from 'express';
import verifyToken from '../middleware/verifyToken';
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
	otpVerification,
	getAllVendor,
	getToken,
	addAddress,
	getAddressesByCustomerId,
	socialLogin,
} from '../controllers/userController';
const router = express.Router();
import authenticateAdmin from '../middleware/authenticateAdmin';

router.post('/login', login);
router.post('/register', register);
router.post('/socialLogin', socialLogin);
router.post('/forgotPassword', forgotPassword);
router.post('/tokenVerification/:token', tokenVerification);
router.post('/otpverification', otpVerification);
router.post('/resetPassword', resetPassword);
router.post('/emailVerification', emailVerification);

// protected route

router.get('/getAllCustomer', verifyToken, getAllCustomer);
router.get('/getAllVendor', verifyToken, getAllVendor);
router.get('/getSingleCustomer/:id', verifyToken, getSingleCustomer);
router.put('/updateCustomer/:id', verifyToken, updateCustomer);
router.delete('/deleteCustomer/:id', verifyToken, deleteCustomer);
router.post('/addAddress', verifyToken, addAddress);
router.get('/getAddresses/:customer_id', verifyToken, getAddressesByCustomerId);
router.get('/getToken', getToken);

export default router;
