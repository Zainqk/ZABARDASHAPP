// routes/index.ts
import express from 'express';
import userRoutes from './userRoutes';
import adminRoutes from './adminRoutes';
import martRoutes from './martRoutes';
const router = express.Router();

// Mount user routes under '/user'
router.use('/user', userRoutes);

// Mount admin routes under '/admin'
router.use('/admin', adminRoutes);

// Mount admin routes under '/admin'
router.use('/mart', martRoutes);

export default router;
