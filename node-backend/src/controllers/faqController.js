const FAQ = require('../models/FAQ');

// Create FAQ
exports.createFAQ = async (req, res) => {
    try {
        const { question, answer, keywords } = req.body;
        
        if (!question || !answer) {
            return res.status(400).json({
                success: false,
                message: 'Question and answer are required'
            });
        }
        
        const newFAQ = new FAQ({
            question,
            answer,
            keywords: keywords || []
        });
        
        const savedFAQ = await newFAQ.save();
        
        res.status(201).json({
            success: true,
            message: 'FAQ created successfully',
            data: savedFAQ
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all FAQs
exports.getAllFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find();
        
        res.status(200).json({
            success: true,
            message: 'FAQs retrieved successfully',
            data: faqs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update FAQ
exports.updateFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, answer, keywords } = req.body;
        
        const updateData = {};
        if (question) updateData.question = question;
        if (answer) updateData.answer = answer;
        if (keywords) updateData.keywords = keywords;
        
        const updated = await FAQ.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'FAQ not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'FAQ updated successfully',
            data: updated
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete FAQ
exports.deleteFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deleted = await FAQ.findByIdAndDelete(id);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'FAQ not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'FAQ deleted successfully',
            data: deleted
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
