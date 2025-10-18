const express = require('express');
const inventoryController = require('../controllers/inventoryController');

const router = express.Router();

router.get('/add', inventoryController.getCreateUser)
router.post('/add', inventoryController.createInventory)
router.get('/view', inventoryController.getViewInventory)
router.get('/delete', inventoryController.getDeleteInventory)
router.delete('/delete/:id', inventoryController.deleteInventory)
router.get('/edit', inventoryController.getEditRecipe)
router.post('/edit', inventoryController.editRecipe)

module.exports = router;