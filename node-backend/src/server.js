const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/database');
const explanationRoutes = require('./routes/explanationRoutes');
const faqRoutes = require('./routes/faqRoutes');
const assistantRoutes = require('./routes/assistantRoutes');
const vectorSearchRoutes = require('./routes/vectorSearchRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:80', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/explanations', explanationRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/search', vectorSearchRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Configuration Assistant Service with Vector Search is running',
        features: {
            semanticSearch: true,
            hybridSearch: true,
            vectorDimensions: 384,
            embeddingModel: 'all-MiniLM-L6-v2'
        }
    });
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Node.js Configuration Assistant running on port ${PORT}`);
    console.log(`📊 Vector Search: ENABLED`);
    console.log(`🤖 Embedding Model: all-MiniLM-L6-v2 (384 dimensions)`);
});

module.exports = app;
