const express = require('express');
const otherController = require('../controllers/otherController');

const router = express.Router();

router.get('/dashboard', otherController.dashboard)

module.exports = router;