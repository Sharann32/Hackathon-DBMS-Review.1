const express = require('express');
const router = express.Router();
const assistantController = require('../controllers/assistantController');

router.post('/query', assistantController.queryAssistant);

module.exports = router;
