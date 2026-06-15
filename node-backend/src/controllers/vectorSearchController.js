/**
 * Vector Search Controller - Semantic search using embeddings
 */

const Explanation = require('../models/Explanation');
const FAQ = require('../models/FAQ');
const embeddingService = require('../services/embeddingService');

/**
 * Perform semantic vector search across explanations and FAQs
 */
exports.semanticSearch = async (req, res) => {
    try {
        const { query, limit = 10 } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Query parameter is required'
            });
        }

        console.log(`🔍 Semantic search for: "${query}"`);

        // Initialize embedding service if needed
        if (!embeddingService.isInitialized) {
            await embeddingService.initialize();
        }

        // Generate query embedding
        const queryEmbedding = await embeddingService.generateEmbedding(query);

        // MongoDB Vector Search using $vectorSearch (Atlas Vector Search)
        // If using Atlas, use the vectorSearch aggregation stage
        // For local MongoDB, we'll use a fallback method
        
        const results = await performVectorSearch(
            queryEmbedding, 
            query, 
            parseInt(limit)
        );

        res.status(200).json({
            success: true,
            message: 'Vector search completed successfully',
            query: query,
            resultsCount: results.length,
            data: results
        });

    } catch (error) {
        console.error('❌ Vector search error:', error);
        res.status(500).json({
            success: false,
            message: 'Vector search failed',
            error: error.message
        });
    }
};

/**
 * Perform hybrid search (vector + keyword)
 */
exports.hybridSearch = async (req, res) => {
    try {
        const { query, limit = 10, vectorWeight = 0.7 } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Query parameter is required'
            });
        }

        console.log(`🔍 Hybrid search for: "${query}"`);

        // Initialize embedding service
        if (!embeddingService.isInitialized) {
            await embeddingService.initialize();
        }

        // Generate query embedding
        const queryEmbedding = await embeddingService.generateEmbedding(query);

        // Get vector search results
        const vectorResults = await performVectorSearch(
            queryEmbedding, 
            query, 
            parseInt(limit) * 2
        );

        // Get keyword search results
        const keywordResults = await performKeywordSearch(query, parseInt(limit) * 2);

        // Merge and rank results
        const mergedResults = mergeSearchResults(
            vectorResults,
            keywordResults,
            parseFloat(vectorWeight),
            parseInt(limit)
        );

        res.status(200).json({
            success: true,
            message: 'Hybrid search completed successfully',
            query: query,
            resultsCount: mergedResults.length,
            data: mergedResults
        });

    } catch (error) {
        console.error('❌ Hybrid search error:', error);
        res.status(500).json({
            success: false,
            message: 'Hybrid search failed',
            error: error.message
        });
    }
};

/**
 * Get recommendations based on a document
 */
exports.getRecommendations = async (req, res) => {
    try {
        const { id, type, limit = 5 } = req.query;

        if (!id || !type) {
            return res.status(400).json({
                success: false,
                message: 'Document ID and type are required'
            });
        }

        // Get the source document
        const Model = type === 'explanation' ? Explanation : FAQ;
        const document = await Model.findById(id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        // Use document's embedding if available, otherwise generate
        let embedding = document.embedding;
        if (!embedding) {
            const text = type === 'explanation' 
                ? `${document.title} ${document.content}`
                : `${document.question} ${document.answer}`;
            embedding = await embeddingService.generateEmbedding(text);
        }

        // Find similar documents
        const recommendations = await performVectorSearch(embedding, '', parseInt(limit) + 1);

        // Remove the source document from results
        const filtered = recommendations.filter(r => r.id !== id);

        res.status(200).json({
            success: true,
            message: 'Recommendations generated successfully',
            sourceDocument: {
                id: document._id,
                title: document.title || document.question,
                type: type
            },
            data: filtered.slice(0, parseInt(limit))
        });

    } catch (error) {
        console.error('❌ Recommendation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate recommendations',
            error: error.message
        });
    }
};

/**
 * Helper: Perform vector search across collections
 */
async function performVectorSearch(queryEmbedding, originalQuery, limit) {
    const results = [];

    try {
        // Search in Explanations
        const explanations = await Explanation.find({ embedding: { $exists: true } });
        
        for (const doc of explanations) {
            if (doc.embedding && doc.embedding.length > 0) {
                const similarity = embeddingService.cosineSimilarity(
                    queryEmbedding, 
                    doc.embedding
                );
                
                results.push({
                    id: doc._id,
                    type: 'explanation',
                    title: doc.title,
                    content: doc.content,
                    keywords: doc.keywords,
                    similarity: similarity,
                    relevance: 'high'
                });
            }
        }

        // Search in FAQs
        const faqs = await FAQ.find({ embedding: { $exists: true } });
        
        for (const doc of faqs) {
            if (doc.embedding && doc.embedding.length > 0) {
                const similarity = embeddingService.cosineSimilarity(
                    queryEmbedding, 
                    doc.embedding
                );
                
                results.push({
                    id: doc._id,
                    type: 'faq',
                    question: doc.question,
                    answer: doc.answer,
                    keywords: doc.keywords,
                    similarity: similarity,
                    relevance: 'high'
                });
            }
        }

        // Sort by similarity and return top results
        results.sort((a, b) => b.similarity - a.similarity);
        return results.slice(0, limit);

    } catch (error) {
        console.error('Error in vector search:', error);
        throw error;
    }
}

/**
 * Helper: Perform keyword search
 */
async function performKeywordSearch(query, limit) {
    const results = [];
    const searchKeywords = query.toLowerCase().split(' ');

    try {
        // Keyword search in Explanations
        const explanations = await Explanation.find({
            $or: [
                { keywords: { $in: searchKeywords } },
                { $text: { $search: query } }
            ]
        }).limit(limit);

        explanations.forEach(doc => {
            results.push({
                id: doc._id,
                type: 'explanation',
                title: doc.title,
                content: doc.content,
                keywords: doc.keywords,
                score: 1.0
            });
        });

        // Keyword search in FAQs
        const faqs = await FAQ.find({
            $or: [
                { keywords: { $in: searchKeywords } },
                { $text: { $search: query } }
            ]
        }).limit(limit);

        faqs.forEach(doc => {
            results.push({
                id: doc._id,
                type: 'faq',
                question: doc.question,
                answer: doc.answer,
                keywords: doc.keywords,
                score: 1.0
            });
        });

        return results;

    } catch (error) {
        console.error('Error in keyword search:', error);
        return [];
    }
}

/**
 * Helper: Merge and rank search results
 */
function mergeSearchResults(vectorResults, keywordResults, vectorWeight, limit) {
    const resultMap = new Map();

    // Add vector results with weight
    vectorResults.forEach(result => {
        const key = result.id.toString();
        resultMap.set(key, {
            ...result,
            finalScore: result.similarity * vectorWeight
        });
    });

    // Add keyword results with weight
    const keywordWeight = 1 - vectorWeight;
    keywordResults.forEach(result => {
        const key = result.id.toString();
        if (resultMap.has(key)) {
            // Boost score if found in both
            const existing = resultMap.get(key);
            existing.finalScore += result.score * keywordWeight;
        } else {
            resultMap.set(key, {
                ...result,
                finalScore: result.score * keywordWeight
            });
        }
    });

    // Convert to array and sort
    const merged = Array.from(resultMap.values());
    merged.sort((a, b) => b.finalScore - a.finalScore);

    return merged.slice(0, limit);
}

module.exports = exports;
