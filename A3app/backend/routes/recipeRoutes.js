const express = require('express');
const recipeController = require('../controllers/recipeController');

const router = express.Router();

router.get('/add', recipeController.getCreateRecipe)
router.post('/add', recipeController.createRecipe)
router.get('/view', recipeController.getViewRecipe)
router.get('/delete', recipeController.getDeleteRecipe)
router.delete('/delete/:id', recipeController.deleteRecipe)
router.get('/edit', recipeController.getEditRecipe)
router.post('/edit', recipeController.editRecipe)

module.exports = router;