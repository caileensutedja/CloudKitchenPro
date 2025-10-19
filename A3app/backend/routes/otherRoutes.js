const express = require('express');

const otherController = require('../controllers/otherController');

const router = express.Router();

router.get('/dashboard', otherController.dashboard);
router.post('/tts', otherController.textToSpeech);

module.exports = router;