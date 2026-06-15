/**
 * Embedding Service - Generate vector embeddings for semantic search
 * Supports both OpenAI and local Transformers.js models
 */

const { pipeline } = require('@xenova/transformers');

class EmbeddingService {
    constructor() {
        this.model = null;
        this.isInitialized = false;
    }

    /**
     * Initialize the embedding model
     * Uses sentence-transformers/all-MiniLM-L6-v2 (384 dimensions)
     */
    async initialize() {
        if (this.isInitialized) return;
        
        try {
            console.log('🔄 Initializing embedding model...');
            this.model = await pipeline(
                'feature-extraction', 
                'Xenova/all-MiniLM-L6-v2'
            );
            this.isInitialized = true;
            console.log('✅ Embedding model initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize embedding model:', error);
            throw error;
        }
    }

    /**
     * Generate embedding vector for text
     * @param {string} text - Text to embed
     * @returns {Array<number>} - 384-dimensional embedding vector
     */
    async generateEmbedding(text) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            // Generate embedding
            const output = await this.model(text, { 
                pooling: 'mean', 
                normalize: true 
            });
            
            // Convert to array
            const embedding = Array.from(output.data);
            
            console.log(`📊 Generated embedding of dimension: ${embedding.length}`);
            return embedding;
        } catch (error) {
            console.error('❌ Error generating embedding:', error);
            throw error;
        }
    }

    /**
     * Generate embeddings for multiple texts (batch processing)
     * @param {Array<string>} texts - Array of texts
     * @returns {Array<Array<number>>} - Array of embedding vectors
     */
    async generateBatchEmbeddings(texts) {
        const embeddings = [];
        
        for (const text of texts) {
            const embedding = await this.generateEmbedding(text);
            embeddings.push(embedding);
        }
        
        return embeddings;
    }

    /**
     * Calculate cosine similarity between two vectors
     * @param {Array<number>} vec1 
     * @param {Array<number>} vec2 
     * @returns {number} - Similarity score (0-1)
     */
    cosineSimilarity(vec1, vec2) {
        if (vec1.length !== vec2.length) {
            throw new Error('Vectors must have same dimensions');
        }

        let dotProduct = 0;
        let norm1 = 0;
        let norm2 = 0;

        for (let i = 0; i < vec1.length; i++) {
            dotProduct += vec1[i] * vec2[i];
            norm1 += vec1[i] * vec1[i];
            norm2 += vec2[i] * vec2[i];
        }

        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }
}

// Singleton instance
const embeddingService = new EmbeddingService();

module.exports = embeddingService;
