// routes/index.ts
import express from 'express';
import userRoutes from './userRoutes';
import adminRoutes from './adminRoutes';

const router = express.Router();

// Mount user routes under '/user'
router.use('/user', userRoutes);

// Mount admin routes under '/admin'
router.use('/admin', adminRoutes);

export default router;
