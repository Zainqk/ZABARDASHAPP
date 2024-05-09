import express from 'express';
import verifyToken from '../middleware/verifyToken';
import {
	addPreference,
	getPreferences,
	getPreferencesByMartId,
} from '../controllers/customerPreferenceController';
const router = express.Router();

// protected routes

router.post('/add', verifyToken, addPreference);
router.get('/getAll', verifyToken, getPreferences);
router.get('/getByMartId', verifyToken, getPreferencesByMartId);

export default router;
