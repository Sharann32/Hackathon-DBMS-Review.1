/**
 * MongoDB Connection Test Script
 * Run with: node src/scripts/testConnection.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
    console.log('🔍 Testing MongoDB Connection...\n');
    
    try {
        console.log('📡 Connection String:');
        console.log(process.env.MONGODB_URI.replace(/\/\/.*:.*@/, '//***:***@'));
        console.log('');
        
        console.log('⏳ Connecting...');
        await mongoose.connect(process.env.MONGODB_URI);
        
        console.log('✅ Successfully connected to MongoDB!');
        console.log('');
        console.log('📊 Connection Details:');
        console.log(`   Database Name: ${mongoose.connection.name}`);
        console.log(`   Host: ${mongoose.connection.host}`);
        console.log(`   Port: ${mongoose.connection.port}`);
        console.log(`   Ready State: ${mongoose.connection.readyState} (1 = connected)`);
        console.log('');
        
        // List collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`📁 Collections in database (${collections.length}):`);
        if (collections.length === 0) {
            console.log('   (No collections yet - database is empty)');
        } else {
            collections.forEach(col => {
                console.log(`   - ${col.name}`);
            });
        }
        console.log('');
        
        // Count documents in each collection
        if (collections.length > 0) {
            console.log('📈 Document counts:');
            for (const col of collections) {
                const count = await mongoose.connection.db.collection(col.name).countDocuments();
                console.log(`   - ${col.name}: ${count} documents`);
            }
            console.log('');
        }
        
        console.log('✨ Connection test completed successfully!');
        console.log('');
        console.log('📝 Next Steps:');
        console.log('   1. Seed database: node src/scripts/seedMongoDB.js');
        console.log('   2. Generate embeddings: node src/scripts/generateEmbeddings.js');
        console.log('   3. Start server: npm start');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Connection failed!');
        console.error('');
        console.error('Error:', error.message);
        console.error('');
        console.error('💡 Troubleshooting:');
        console.error('   1. Check .env file has correct MONGODB_URI');
        console.error('   2. Verify MongoDB Atlas IP whitelist (add 0.0.0.0/0 for testing)');
        console.error('   3. Confirm database user credentials are correct');
        console.error('   4. Check if MongoDB Atlas cluster is running');
        console.error('   5. Test network connectivity to MongoDB Atlas');
        
        process.exit(1);
    }
}

testConnection();
