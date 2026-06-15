/**
 * MongoDB Seed Script - Populate database with sample data
 * Run with: node src/scripts/seedMongoDB.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Explanation = require('../models/Explanation');
const FAQ = require('../models/FAQ');

// Sample data
const explanations = [
    {
        title: "How to Configure Settings",
        content: "Settings can be configured through the Settings page. Navigate to Settings from the sidebar, select a setting, and click Edit to modify its value. System settings require admin privileges.",
        keywords: ["settings", "configure", "edit", "modify", "admin"]
    },
    {
        title: "Understanding Categories",
        content: "Categories help organize settings into logical groups like Security, Appearance, Notifications, etc. Each setting belongs to one category. Admins can create and manage categories from the Categories page.",
        keywords: ["categories", "organize", "groups", "admin", "management"]
    },
    {
        title: "User Roles and Permissions",
        content: "The system has two roles: Admin and User. Admins have full access to all features including user management, while Users can only view system settings and manage their personal settings.",
        keywords: ["roles", "permissions", "admin", "user", "access", "rbac"]
    },
    {
        title: "Search Functionality",
        content: "Use the search feature to quickly find settings. The system supports both keyword-based search and semantic search powered by AI, which understands the meaning of your query.",
        keywords: ["search", "find", "semantic", "ai", "query", "keyword"]
    },
    {
        title: "Theme and Language Preferences",
        content: "Customize your experience by changing theme (Light/Dark) and language (English/Telugu/Hindi) from the User Preferences page. Your preferences are saved and applied across sessions.",
        keywords: ["theme", "language", "preferences", "dark", "light", "customize"]
    },
    {
        title: "Security Settings Overview",
        content: "Security settings control password policies, session timeouts, and two-factor authentication. Admins can enforce minimum password length, require special characters, and set automatic logout after inactivity to protect user accounts.",
        keywords: ["security", "password", "authentication", "2fa", "session", "timeout", "policy"]
    },
    {
        title: "Notification Configuration",
        content: "Configure how and when you receive notifications. Options include email notifications for important events, browser notifications for real-time alerts, and notification preferences for different event types like system updates or setting changes.",
        keywords: ["notifications", "email", "alerts", "browser", "events", "updates"]
    },
    {
        title: "Audit Log System",
        content: "The audit log tracks all changes made to settings including who made the change, when it occurred, and what was modified. Admins can view complete audit trails from the Audit Logs page for compliance and troubleshooting.",
        keywords: ["audit", "logs", "tracking", "history", "compliance", "changes", "admin"]
    },
    {
        title: "Data Type Support",
        content: "Settings support multiple data types: STRING for text values, INTEGER for whole numbers, BOOLEAN for true/false flags, and JSON for complex structured data. Choose the appropriate type when creating settings.",
        keywords: ["data", "types", "string", "integer", "boolean", "json", "format"]
    },
    {
        title: "User Profile Management",
        content: "Manage your profile information including name, email, and avatar from the Profile page. Update your personal details and password. Profile changes are immediately reflected across the application.",
        keywords: ["profile", "user", "personal", "information", "avatar", "email", "name"]
    },
    {
        title: "Dark Mode Implementation",
        content: "The application features a modern dark theme with a futuristic design. Toggle between light and dark modes from the header or user preferences. The dark theme uses deep backgrounds with vibrant gradient accents for optimal readability.",
        keywords: ["dark", "mode", "theme", "appearance", "ui", "design", "toggle"]
    },
    {
        title: "API Integration Guide",
        content: "The system provides RESTful APIs for all operations. Authentication uses JWT tokens. Include the token in Authorization header as 'Bearer <token>'. API documentation includes endpoints for settings, categories, users, and audit logs.",
        keywords: ["api", "rest", "jwt", "authentication", "integration", "endpoints", "token"]
    },
    {
        title: "Database Architecture",
        content: "The application uses a hybrid database architecture: PostgreSQL for relational data (users, settings, categories) and MongoDB for AI-powered features (explanations, FAQs with vector embeddings). This provides both ACID compliance and semantic search capabilities.",
        keywords: ["database", "postgresql", "mongodb", "architecture", "hybrid", "vector", "embeddings"]
    },
    {
        title: "Multi-Language Support",
        content: "The system supports English, Telugu, and Hindi languages. Change language from User Preferences. The interface automatically translates labels, messages, and UI elements to your selected language.",
        keywords: ["language", "multilingual", "translation", "english", "telugu", "hindi", "i18n"]
    },
    {
        title: "Setting Scopes Explained",
        content: "SYSTEM scope settings are global and apply to all users. USER scope settings are personal and each user has their own values. GLOBAL scope affects the entire application behavior. Choose the appropriate scope when creating settings.",
        keywords: ["scope", "system", "user", "global", "personal", "settings", "visibility"]
    },
    {
        title: "Access Control System",
        content: "Role-Based Access Control (RBAC) restricts features based on user roles. Admins can create users, manage settings, and view audit logs. Regular users can only modify their personal settings and preferences.",
        keywords: ["access", "control", "rbac", "roles", "permissions", "authorization", "security"]
    },
    {
        title: "Vector Search Technology",
        content: "The AI Assistant uses 384-dimensional vector embeddings to understand query meaning. It converts questions into numerical vectors and finds semantically similar content, even when exact keywords don't match.",
        keywords: ["vector", "search", "ai", "semantic", "embeddings", "nlp", "machine learning"]
    },
    {
        title: "Hybrid Search Strategy",
        content: "Hybrid search combines AI semantic understanding with traditional keyword matching. This provides better results by leveraging both the contextual awareness of AI and the precision of exact keyword matches.",
        keywords: ["hybrid", "search", "semantic", "keyword", "ai", "combined", "strategy"]
    },
    {
        title: "Dashboard Analytics",
        content: "The dashboard displays key metrics including total settings count, categories distribution, recent changes, and user activity. Admins see additional statistics like total users and audit log entries.",
        keywords: ["dashboard", "analytics", "metrics", "statistics", "overview", "admin"]
    },
    {
        title: "Setting Validation Rules",
        content: "Settings can have validation rules to ensure data integrity. Define minimum/maximum values for numbers, regex patterns for strings, and required fields. Validation occurs before saving to prevent invalid configurations.",
        keywords: ["validation", "rules", "integrity", "constraints", "regex", "data quality"]
    }
];

const faqs = [
    {
        question: "How do I reset my password?",
        answer: "Click on your profile icon, go to Profile Settings, and select 'Change Password'. Enter your current password and new password to update it.",
        keywords: ["password", "reset", "change", "profile", "security"]
    },
    {
        question: "What is the difference between SYSTEM and USER scope settings?",
        answer: "SYSTEM settings are global and affect all users. Only admins can modify them. USER settings are personal and each user has their own values that they can customize.",
        keywords: ["system", "user", "scope", "global", "personal", "settings"]
    },
    {
        question: "How do I create a new category?",
        answer: "Navigate to the Categories page and click 'Create Category' button (admin only). Provide a name and description for the category. Settings can then be assigned to this category.",
        keywords: ["category", "create", "admin", "new", "organize"]
    },
    {
        question: "Can I export my settings?",
        answer: "Yes, admins can export all settings from the Settings page using the Export button. The data is exported in JSON format for backup or migration purposes.",
        keywords: ["export", "backup", "json", "download", "settings", "admin"]
    },
    {
        question: "Why can't I see the Users page?",
        answer: "The Users page is only accessible to administrators. If you need access to user management features, contact your system administrator to upgrade your account role.",
        keywords: ["users", "admin", "access", "permissions", "role", "privilege"]
    },
    {
        question: "How do I enable dark mode?",
        answer: "Click the theme toggle button in the header (sun/moon icon) or go to User Preferences and select 'Dark' theme. Your preference is saved automatically.",
        keywords: ["dark", "mode", "theme", "toggle", "appearance", "ui"]
    },
    {
        question: "What languages are supported?",
        answer: "The system supports English, Telugu, and Hindi. Change your language from User Preferences. The interface will automatically translate to your selected language.",
        keywords: ["language", "translation", "english", "telugu", "hindi", "multilingual"]
    },
    {
        question: "How does the AI Assistant work?",
        answer: "The AI Assistant uses vector embeddings and semantic search to understand your questions. It finds relevant information even when your query doesn't use exact keywords, making it smarter than traditional search.",
        keywords: ["ai", "assistant", "vector", "semantic", "search", "embeddings"]
    },
    {
        question: "Can I delete a setting?",
        answer: "Yes, admins can delete settings from the Settings page. Click the delete icon next to a setting and confirm. Note that deleting a setting is permanent and cannot be undone.",
        keywords: ["delete", "remove", "setting", "admin", "permanent"]
    },
    {
        question: "How do I view audit logs?",
        answer: "Admins can view audit logs from the Audit Logs page in the sidebar. Logs show who changed what and when, including old and new values for complete traceability.",
        keywords: ["audit", "logs", "history", "tracking", "admin", "changes"]
    },
    {
        question: "What is semantic search vs keyword search?",
        answer: "Semantic search understands the meaning of your query using AI, finding relevant results even with different wording. Keyword search matches exact words. The AI Assistant offers both through semantic and hybrid modes.",
        keywords: ["semantic", "keyword", "search", "ai", "difference", "comparison"]
    },
    {
        question: "How do I add a new user?",
        answer: "Admins can add users from the Users page by clicking 'Create User'. Provide email, name, password, and assign a role (Admin or User). New users receive credentials to login.",
        keywords: ["user", "add", "create", "admin", "new", "registration"]
    },
    {
        question: "What data types can settings have?",
        answer: "Settings support STRING (text), INTEGER (numbers), BOOLEAN (true/false), and JSON (structured data). Choose the appropriate type when creating a setting based on the value you need to store.",
        keywords: ["data", "types", "string", "integer", "boolean", "json"]
    },
    {
        question: "How do I filter settings by category?",
        answer: "On the Settings page, use the category filter dropdown to view settings from a specific category. You can also search settings by name or key using the search box.",
        keywords: ["filter", "category", "search", "settings", "organize"]
    },
    {
        question: "Can I customize my preferences?",
        answer: "Yes! Go to User Preferences to customize theme (light/dark), language (English/Telugu/Hindi), date format, and time format. All preferences are saved per user.",
        keywords: ["preferences", "customize", "theme", "language", "format", "personal"]
    },
    {
        question: "What is the dashboard showing?",
        answer: "The dashboard displays statistics including total settings, categories, recent activity, and user count (admin only). It provides a quick overview of your system configuration.",
        keywords: ["dashboard", "statistics", "overview", "metrics", "summary"]
    },
    {
        question: "How secure is my password?",
        answer: "Passwords are hashed using BCrypt before storage. The system enforces minimum length requirements and supports password strength validation. Change your password regularly from Profile settings.",
        keywords: ["password", "security", "bcrypt", "hash", "encryption", "safe"]
    },
    {
        question: "Can I undo a setting change?",
        answer: "While there's no direct undo button, admins can view the old value in audit logs and manually revert the change by editing the setting back to its previous value.",
        keywords: ["undo", "revert", "change", "audit", "rollback"]
    },
    {
        question: "What is JWT authentication?",
        answer: "JWT (JSON Web Token) is used for secure authentication. After login, you receive a token that's included in API requests. Tokens expire after a set time for security.",
        keywords: ["jwt", "authentication", "token", "security", "login", "api"]
    },
    {
        question: "How do I logout?",
        answer: "Click the 'Logout' button in the header (top right). This will clear your session and JWT token, requiring you to login again to access the system.",
        keywords: ["logout", "signout", "exit", "session", "end"]
    }
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        console.log('📡 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas');
        console.log(`📊 Database: ${mongoose.connection.name}\n`);

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Explanation.deleteMany({});
        await FAQ.deleteMany({});
        console.log('✅ Cleared existing data\n');

        // Insert Explanations
        console.log('📚 Inserting Explanations...');
        const insertedExplanations = await Explanation.insertMany(explanations);
        console.log(`✅ Inserted ${insertedExplanations.length} explanations`);
        insertedExplanations.forEach((exp, index) => {
            console.log(`   ${index + 1}. ${exp.title}`);
        });

        // Insert FAQs
        console.log('\n❓ Inserting FAQs...');
        const insertedFAQs = await FAQ.insertMany(faqs);
        console.log(`✅ Inserted ${insertedFAQs.length} FAQs`);
        insertedFAQs.forEach((faq, index) => {
            console.log(`   ${index + 1}. ${faq.question}`);
        });

        // Summary
        console.log('\n═══════════════════════════════════════');
        console.log('📊 DATABASE SEEDING SUMMARY');
        console.log('═══════════════════════════════════════');
        console.log(`✅ Total Explanations: ${insertedExplanations.length}`);
        console.log(`✅ Total FAQs: ${insertedFAQs.length}`);
        console.log(`📍 Database: ${mongoose.connection.name}`);
        console.log(`🌐 Connection: MongoDB Atlas`);
        console.log('═══════════════════════════════════════\n');

        console.log('✨ Database seeded successfully!');
        console.log('\n📝 Next Steps:');
        console.log('   1. Start Node.js backend: npm start');
        console.log('   2. Generate embeddings: node src/scripts/generateEmbeddings.js');
        console.log('   3. Test API: http://localhost:3001/api/explanations\n');

        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        console.error('\nTroubleshooting:');
        console.error('   - Check MongoDB Atlas connection string in .env');
        console.error('   - Verify network access in Atlas (IP whitelist)');
        console.error('   - Confirm database user has write permissions');
        process.exit(1);
    }
}

// Run the seed script
console.log('🌱 MongoDB Seed Script Starting...\n');
seedDatabase();
