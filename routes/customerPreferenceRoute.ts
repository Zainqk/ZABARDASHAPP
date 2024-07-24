import express from 'express';
import verifyToken from '../middleware/verifyToken';
import {
	addPreference,
	getPreferences,
	getPreferencesByMartId,
	getPreferencesByCustomerId,
} from '../controllers/customerPreferenceController';
const router = express.Router();

// protected routes

router.post('/add', verifyToken, addPreference);
router.get('/getAll', verifyToken, getPreferences);
router.get('/getByMartId', verifyToken, getPreferencesByMartId);
router.get(
	'/getPrefrenceByCustomerId',
	verifyToken,
	getPreferencesByCustomerId
);

export default router;
