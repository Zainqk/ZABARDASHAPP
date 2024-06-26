import express from 'express';
import verifyToken from '../middleware/verifyToken';
import {
	addInventory,
	getAllInventory,
	deleteInventory,
	updateStockQuantity,
	getAllInventoryAgainstStore,
} from '../controllers/inventoryController';
const router = express.Router();

// protected route

router.post('/add', verifyToken, addInventory);
router.get('/getAll', verifyToken, getAllInventory);
router.delete('/delete/:id', verifyToken, deleteInventory);
router.post('/updateqty', verifyToken, updateStockQuantity);
router.get('/getAgainstStore/:id', verifyToken, getAllInventoryAgainstStore);

export default router;
