const Explanation = require('../models/Explanation');

// Create explanation
exports.createExplanation = async (req, res) => {
    try {
        const { title, keywords, explanation, content } = req.body;
        
        // Accept both 'explanation' and 'content' for backward compatibility
        const contentValue = content || explanation;
        
        if (!title || !keywords || !contentValue) {
            return res.status(400).json({
                success: false,
                message: 'Title, keywords, and content are required'
            });
        }
        
        const newExplanation = new Explanation({
            title,
            keywords,
            content: contentValue
        });
        
        const savedExplanation = await newExplanation.save();
        
        res.status(201).json({
            success: true,
            message: 'Explanation created successfully',
            data: savedExplanation
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all explanations
exports.getAllExplanations = async (req, res) => {
    try {
        const explanations = await Explanation.find();
        
        res.status(200).json({
            success: true,
            message: 'Explanations retrieved successfully',
            data: explanations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Search explanations
exports.searchExplanations = async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Query parameter "q" is required'
            });
        }
        
        const searchKeywords = q.toLowerCase().split(' ');
        
        const results = await Explanation.find({
            $or: [
                { keywords: { $in: searchKeywords } },
                { $text: { $search: q } }
            ]
        });
        
        res.status(200).json({
            success: true,
            message: 'Search completed successfully',
            data: results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update explanation
exports.updateExplanation = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, keywords, explanation, content } = req.body;
        
        const contentValue = content || explanation;
        
        const updateData = {};
        if (title) updateData.title = title;
        if (keywords) updateData.keywords = keywords;
        if (contentValue) updateData.content = contentValue;
        
        const updated = await Explanation.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Explanation not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Explanation updated successfully',
            data: updated
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete explanation
exports.deleteExplanation = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deleted = await Explanation.findByIdAndDelete(id);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Explanation not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Explanation deleted successfully',
            data: deleted
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
