// routes/index.ts
import express from 'express';
import userRoutes from './userRoutes';
import adminRoutes from './adminRoutes';
import martRoutes from './martRoutes';
import productRoutes from './productRoutes';
import orderRoutes from './orderRoutes';
import recipesRoutes from './recipesRoutes';
import categoryRoutes from './categoryRoute';
const router = express.Router();

// Mount user routes under '/user'
router.use('/user', userRoutes);

// Mount admin routes under '/admin'
router.use('/admin', adminRoutes);

// Mount admin routes under '/mart'
router.use('/mart', martRoutes);

// Mount admin routes under '/product'
router.use('/product', productRoutes);

// Mount admin routes under '/order'
router.use('/order', orderRoutes);

// Mount admin routes under '/recipe'
router.use('/recipe', recipesRoutes);

// Mount admin routes under '/category'
router.use('/category', categoryRoutes);

export default router;
