# Database Setup Instructions

## Quick Setup Guide

### Prerequisites:
1. PostgreSQL installed and running
2. MongoDB installed and running

---

## 🐘 PostgreSQL Setup

### Step 1: Start PostgreSQL
```powershell
# Windows - Start service
net start postgresql-x64-14

# Or search "Services" in Windows and start "PostgreSQL" service
```

### Step 2: Run Setup Scripts

#### Option A: Using psql Command Line
```powershell
# Navigate to database folder
cd database/postgresql

# Run the setup script
psql -U postgres -f 01-create-database.sql

# Run sample data script
psql -U postgres -f 02-insert-sample-data.sql
```

#### Option B: Using pgAdmin
1. Open pgAdmin
2. Right-click on "PostgreSQL" → "Query Tool"
3. Open file `01-create-database.sql`
4. Execute (F5)
5. Open file `02-insert-sample-data.sql`
6. Execute (F5)

#### Option C: Manual Commands
```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE settings_db;

-- Exit and run the script
\q
psql -U postgres -d settings_db -f database/postgresql/01-create-database.sql
```

### Step 3: Verify PostgreSQL Setup
```sql
-- Connect to database
psql -U postgres -d settings_db

-- Check tables
\dt

-- You should see:
-- roles
-- users
-- user_roles
-- setting_categories
-- settings
-- audit_logs

-- Check sample categories
SELECT * FROM setting_categories;

-- Exit
\q
```

---

## 🍃 MongoDB Setup

### Step 1: Start MongoDB
```powershell
# Windows - Start service
net start MongoDB

# Or manually:
mongod --dbpath="C:\data\db"

# Or search "Services" in Windows and start "MongoDB" service
```

### Step 2: Run Setup Script

#### Option A: Using mongosh (MongoDB Shell)
```powershell
# Navigate to database folder
cd database/mongodb

# Run the setup script
mongosh < 01-create-collections.js
```

#### Option B: Using MongoDB Compass
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Create database: `configuration_assistant`
4. Open mongosh tab at bottom
5. Copy and paste contents of `01-create-collections.js`
6. Execute

#### Option C: Manual Commands
```javascript
// Connect to MongoDB
mongosh

// Switch to database
use configuration_assistant

// Create collections
db.createCollection("explanations")
db.createCollection("faqs")

// Create indexes
db.explanations.createIndex({ "keywords": 1 })
db.explanations.createIndex({ "title": "text", "explanation": "text" })
db.faqs.createIndex({ "question": "text", "answer": "text" })

// Exit
exit
```

### Step 3: Verify MongoDB Setup
```javascript
// Connect to MongoDB
mongosh

// Use database
use configuration_assistant

// Check collections
show collections

// You should see:
// explanations
// faqs

// Check sample data
db.explanations.count()
db.faqs.count()

// Exit
exit
```

---

## 📊 Database Credentials

### PostgreSQL (Default):
- **Host**: localhost
- **Port**: 5432
- **Database**: settings_db
- **Username**: postgres
- **Password**: postgres (or your password)

### MongoDB (Default):
- **Host**: localhost
- **Port**: 27017
- **Database**: configuration_assistant
- **No authentication** (default local setup)

---

## 🔄 Update Configuration Files

### Spring Boot - application.yml
Already configured at: `spring-backend/src/main/resources/application.yml`

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/settings_db
    username: postgres
    password: postgres  # Change if different
```

### Node.js - .env
Already configured at: `node-backend/.env`

```env
MONGODB_URI=mongodb://localhost:27017/configuration_assistant
```

---

## ✅ Verification Checklist

- [ ] PostgreSQL service running
- [ ] MongoDB service running
- [ ] PostgreSQL database `settings_db` created
- [ ] PostgreSQL tables created (6 tables)
- [ ] PostgreSQL sample categories inserted
- [ ] MongoDB database `configuration_assistant` created
- [ ] MongoDB collections created (explanations, faqs)
- [ ] MongoDB sample data inserted

---

## 🚀 Next Steps

Once databases are set up:

1. **Start Spring Boot**:
   - Open in IntelliJ IDEA or Eclipse
   - Run `SettingsManagementApplication`

2. **Access Application**:
   - Frontend: http://localhost:5173
   - Register first user (will be USER role)

3. **Create Admin User**:
```sql
-- Connect to PostgreSQL
psql -U postgres -d settings_db

-- Make first user an admin
UPDATE user_roles 
SET role_id = (SELECT id FROM roles WHERE role_name = 'ADMIN') 
WHERE user_id = 1;
```

---

## 🔧 Troubleshooting

### PostgreSQL Connection Refused:
```powershell
# Check if running
pg_isready

# Restart service
net stop postgresql-x64-14
net start postgresql-x64-14
```

### MongoDB Connection Refused:
```powershell
# Check if running
mongosh --eval "db.runCommand({ping: 1})"

# Restart service
net stop MongoDB
net start MongoDB
```

### Can't find psql or mongosh:
Add to PATH or use full path:
- psql: `C:\Program Files\PostgreSQL\14\bin\psql`
- mongosh: `C:\Program Files\MongoDB\Server\6.0\bin\mongosh`

---

## 📝 Sample Data Included

### PostgreSQL:
- 2 Roles (ADMIN, USER)
- 6 Categories (Email, Security, Notification, General, API, Database)

### MongoDB:
- 5 Configuration Explanations
- 5 FAQs

You can add more through the application UI once running!

---

## 🎯 Quick Test

After setup, test the databases:

```powershell
# Test PostgreSQL
psql -U postgres -d settings_db -c "SELECT COUNT(*) FROM setting_categories;"

# Test MongoDB
mongosh configuration_assistant --eval "db.explanations.count()"
```

Both should return numbers > 0 if sample data is loaded.
