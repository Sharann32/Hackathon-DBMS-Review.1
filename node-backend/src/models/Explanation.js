const mongoose = require('mongoose');

const explanationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        alias: 'explanation'
    },
    keywords: [{
        type: String,
        required: true,
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

// Virtual for backward compatibility
explanationSchema.virtual('explanation').get(function() {
    return this.content;
}).set(function(value) {
    this.content = value;
});

// Indexes
explanationSchema.index({ keywords: 1 });
explanationSchema.index({ title: 'text', content: 'text' });

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

module.exports = mongoose.model('Explanation', explanationSchema);
