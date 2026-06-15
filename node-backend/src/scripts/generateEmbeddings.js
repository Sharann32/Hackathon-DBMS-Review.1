/**
 * Script to generate embeddings for existing documents
 * Run with: node src/scripts/generateEmbeddings.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Explanation = require('../models/Explanation');
const FAQ = require('../models/FAQ');
const embeddingService = require('../services/embeddingService');

async function generateEmbeddings() {
    try {
        // Connect to MongoDB
        console.log('📡 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Initialize embedding service
        console.log('🔄 Initializing embedding model...');
        await embeddingService.initialize();
        console.log('✅ Embedding model ready\n');

        // Process Explanations
        console.log('📚 Processing Explanations...');
        const explanations = await Explanation.find({});
        let explanationCount = 0;

        for (const doc of explanations) {
            try {
                const text = `${doc.title} ${doc.content || doc.explanation || ''}`;
                const embedding = await embeddingService.generateEmbedding(text);
                
                doc.embedding = embedding;
                doc.embeddingModel = 'all-MiniLM-L6-v2';
                await doc.save();
                
                explanationCount++;
                console.log(`  ✓ Generated embedding for: "${doc.title}"`);
            } catch (error) {
                console.error(`  ✗ Failed for "${doc.title}":`, error.message);
            }
        }
        console.log(`✅ Processed ${explanationCount}/${explanations.length} explanations\n`);

        // Process FAQs
        console.log('❓ Processing FAQs...');
        const faqs = await FAQ.find({});
        let faqCount = 0;

        for (const doc of faqs) {
            try {
                const text = `${doc.question} ${doc.answer}`;
                const embedding = await embeddingService.generateEmbedding(text);
                
                doc.embedding = embedding;
                doc.embeddingModel = 'all-MiniLM-L6-v2';
                await doc.save();
                
                faqCount++;
                console.log(`  ✓ Generated embedding for: "${doc.question}"`);
            } catch (error) {
                console.error(`  ✗ Failed for "${doc.question}":`, error.message);
            }
        }
        console.log(`✅ Processed ${faqCount}/${faqs.length} FAQs\n`);

        // Summary
        console.log('═══════════════════════════════════════');
        console.log('📊 EMBEDDING GENERATION SUMMARY');
        console.log('═══════════════════════════════════════');
        console.log(`✅ Total Explanations: ${explanationCount}`);
        console.log(`✅ Total FAQs: ${faqCount}`);
        console.log(`📐 Embedding Dimensions: 384`);
        console.log(`🤖 Model: all-MiniLM-L6-v2`);
        console.log('═══════════════════════════════════════\n');

        console.log('✨ All embeddings generated successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error generating embeddings:', error);
        process.exit(1);
    }
}

// Run the script
generateEmbeddings();
