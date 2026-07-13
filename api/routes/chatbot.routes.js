const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbot.controller');

router.post('/consultar', chatbotController.consultarIA);

module.exports = router;