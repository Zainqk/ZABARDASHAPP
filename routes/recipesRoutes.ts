import express from 'express';
import verifyToken from '../middleware/verifyToken';
import { addRecipes, getAllRecipes } from '../controllers/recipesController';
const router = express.Router();

// protected routes

router.post('/addrecipes', verifyToken, addRecipes);
router.get('/getallrecipes', verifyToken, getAllRecipes);
// router.get('/getcustomerfavouritemart', verifyToken, getCustomerFavoriteMart);
// router.post('/addmartrating', verifyToken, addMartRating);
// router.post('/addmartcustomerfavourite', verifyToken, addMartCustomerFavourite);

export default router;
