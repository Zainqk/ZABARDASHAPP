// routes/index.ts
import express from 'express';
import userRoutes from './userRoutes';
import adminRoutes from './adminRoutes';
import martRoutes from './martRoutes';
import productRoutes from './productRoutes';
import orderRoutes from './orderRoutes';
import recipesRoutes from './recipesRoutes';
import categoryRoutes from './categoryRoute';
import inventoryRoutes from './inventoryRoute';
const router = express.Router();

router.use('/user', userRoutes);

router.use('/admin', adminRoutes);

router.use('/mart', martRoutes);

router.use('/product', productRoutes);

router.use('/order', orderRoutes);

router.use('/recipe', recipesRoutes);

router.use('/category', categoryRoutes);

router.use('/inventory', inventoryRoutes);

export default router;
