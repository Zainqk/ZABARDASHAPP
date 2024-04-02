import express from 'express';
import verifyToken from '../middleware/verifyToken';
import { addCategory } from '../controllers/categoryController';
const router = express.Router();

// protected routes
// router.post('/addcategory', verifyToken, addCategory);
router.post('/addcategory', verifyToken, addCategory);

export default router;
