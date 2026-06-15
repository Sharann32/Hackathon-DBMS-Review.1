-- ================================================
-- Sample Data Insert Script
-- Settings and Configuration Management System
-- ================================================

-- Connect to database
\c settings_db;

-- Insert roles
INSERT INTO roles (role_name) VALUES 
    ('ADMIN'),
    ('USER')
ON CONFLICT (role_name) DO NOTHING;

-- Insert sample categories
INSERT INTO setting_categories (name, description) VALUES 
    ('Appearance', 'Visual and theme settings'),
    ('Notifications', 'Notification and alert preferences'),
    ('Security', 'Security and authentication settings'),
    ('Localization', 'Language and regional settings'),
    ('Dashboard', 'Dashboard layout and display options'),
    ('Privacy', 'Privacy and data settings'),
    ('Accessibility', 'Accessibility features and options'),
    ('Email', 'Email configuration settings'),
    ('General', 'General application settings'),
    ('API', 'API configuration settings'),
    ('Database', 'Database connection settings')
ON CONFLICT (name) DO NOTHING;

-- Success message
SELECT 'Sample data inserted successfully!' AS status;
SELECT 'You can now register users through the application' AS next_step;
