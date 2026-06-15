const Explanation = require('../models/Explanation');
const FAQ = require('../models/FAQ');

// Natural language query handler
exports.queryAssistant = async (req, res) => {
    try {
        const { query } = req.body;
        
        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Query is required'
            });
        }
        
        const searchKeywords = query.toLowerCase().split(' ');
        
        // Search in explanations
        const explanations = await Explanation.find({
            $or: [
                { keywords: { $in: searchKeywords } },
                { $text: { $search: query } }
            ]
        }).limit(5);
        
        // Search in FAQs
        const faqs = await FAQ.find({
            $or: [
                { keywords: { $in: searchKeywords } },
                { $text: { $search: query } }
            ]
        }).limit(5);
        
        const response = {
            query: query,
            explanations: explanations,
            faqs: faqs,
            total: explanations.length + faqs.length
        };
        
        if (response.total === 0) {
            return res.status(200).json({
                success: true,
                message: 'No results found for your query',
                data: response
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Query processed successfully',
            data: response
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
