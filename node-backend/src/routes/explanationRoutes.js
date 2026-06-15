const express = require('express');
const router = express.Router();
const explanationController = require('../controllers/explanationController');

router.post('/', explanationController.createExplanation);
router.get('/', explanationController.getAllExplanations);
router.get('/search', explanationController.searchExplanations);
router.put('/:id', explanationController.updateExplanation);
router.delete('/:id', explanationController.deleteExplanation);

module.exports = router;
