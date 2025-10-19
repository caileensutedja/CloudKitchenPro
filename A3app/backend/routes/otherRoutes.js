const express = require('express');

const otherController = require('../controllers/otherController');

const router = express.Router();

// ============================================
// OTHER ROUTER
// ============================================
router.get('/dashboard', otherController.dashboard);
router.post('/tts', otherController.textToSpeech);
router.post('/ask-gemini', otherController.askGemini);

module.exports = router;