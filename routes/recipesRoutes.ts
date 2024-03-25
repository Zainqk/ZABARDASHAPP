import express from 'express';
import verifyToken from '../middleware/verifyToken';
import {
	addRecipes,
	getAllRecipes,
	addIngredient,
	addInstruction,
	getRecipesDetailByRecipesId,
} from '../controllers/recipesController';
const router = express.Router();

// protected routes
router.post('/addrecipes', verifyToken, addRecipes);
router.get('/getallrecipes', verifyToken, getAllRecipes);
router.post('/addingredient', verifyToken, addIngredient);
router.post('/addinstruction', verifyToken, addInstruction);
router.get('/getrecipesdetail/:id', verifyToken, getRecipesDetailByRecipesId);
export default router;
