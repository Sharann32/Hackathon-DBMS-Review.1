const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true
    },
    answer: {
        type: String,
        required: true
    },
    keywords: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    embedding: {
        type: [Number],
        default: null,
        index: false
    },
    embeddingModel: {
        type: String,
        default: 'all-MiniLM-L6-v2'
    }
}, {
    timestamps: true
});

// Indexes
faqSchema.index({ question: 'text', answer: 'text' });

// Vector search index (for MongoDB Atlas Vector Search)
// This needs to be created manually in Atlas:
// {
//   "fields": [{
//     "type": "vector",
//     "path": "embedding",
//     "numDimensions": 384,
//     "similarity": "cosine"
//   }]
// }

module.exports = mongoose.model('FAQ', faqSchema);
