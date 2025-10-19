const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// ============================================
// USER ROUTER
// ============================================
// ROUTES
router.get('/register', userController.getRegister);
router.post('/register', userController.createUser);
router.get('/login', userController.getLogin);
router.post('/login', userController.loginUser);

module.exports = router;
