/**
 * Vector Search Routes - Semantic search endpoints
 */

const express = require('express');
const router = express.Router();
const vectorSearchController = require('../controllers/vectorSearchController');

// Semantic vector search
router.get('/semantic', vectorSearchController.semanticSearch);

// Hybrid search (vector + keyword)
router.get('/hybrid', vectorSearchController.hybridSearch);

// Get recommendations based on a document
router.get('/recommendations', vectorSearchController.getRecommendations);

module.exports = router;
