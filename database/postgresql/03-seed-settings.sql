-- ================================================
-- Seed Data for Settings
-- Insert sample settings for each category
-- ================================================

\c settings_db;

-- Note: Run this after registering at least one user
-- Replace user_id values with actual user IDs from your system

-- Appearance Settings
INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by) 
SELECT 'theme.default', 'light', 'Default application theme', id, 'SYSTEM', 1, 1
FROM setting_categories WHERE name = 'Appearance'
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by)
SELECT 'theme.colors.primary', '#3b82f6', 'Primary brand color', id, 'SYSTEM', 1, 1
FROM setting_categories WHERE name = 'Appearance'
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by)
SELECT 'theme.font.family', 'Inter, system-ui, sans-serif', 'Default font family', id, 'SYSTEM', 1, 1
FROM setting_categories WHERE name = 'Appearance'
ON CONFLICT (key) DO NOTHING;

-- Notification Settings
INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by)
SELECT 'notifications.email.enabled', 'true', 'Enable email notifications', id, 'SYSTEM', 1, 1
FROM setting_categories WHERE name = 'Notifications'
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by)
SELECT 'notifications.push.enabled', 'true', 'Enable push notifications', id, 'SYSTEM', 1, 1
FROM setting_categories WHERE name = 'Notifications'
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by)
SELECT 'notifications.digest.frequency', 'daily', 'Notification digest frequency', id, 'SYSTEM', 1, 1
FROM setting_categories WHERE name = 'Notifications'
ON CONFLICT (key) DO NOTHING;

-- Security Settings
INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by)
SELECT 'security.jwt.expiration', '86400000', 'JWT token expiration time in milliseconds', id, 'SYSTEM', 1, 1
FROM setting_categories WHERE name = 'Security'
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by)
SELECT 'security.password.minLength', '8', 'Minimum password length', id, 'SYSTEM', 1, 1
FROM setting_categories WHERE name = 'Security'
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by)
SELECT 'security.session.timeout', '1800000', 'Session timeout in milliseconds', id, 'SYSTEM', 1, 1
FROM setting_categories WHERE name = 'Security'
ON CONFLICT (key) DO NOTHING;

-- Localization Settings
INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by)
SELECT 'localization.default.language', 'en', 'Default application language', id, 'SYSTEM', 1, 1
FROM setting_categories WHERE name = 'Localization'
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by)
SELECT 'localization.default.timezone', 'Asia/Kolkata', 'Default timezone', id, 'SYSTEM', 1, 1
FROM setting_categories WHERE name = 'Localization'
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by)
SELECT 'localization.date.format', 'DD/MM/YYYY', 'Default date format', id, 'SYSTEM', 1, 1
FROM setting_categories WHERE name = 'Localization'
ON CONFLICT (key) DO NOTHING;

-- Dashboard Settings
INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by)
SELECT 'dashboard.layout', 'grid', 'Default dashboard layout', id, 'SYSTEM', 1, 1
FROM setting_categories WHERE name = 'Dashboard'
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by)
SELECT 'dashboard.refresh.interval', '30000', 'Dashboard auto-refresh interval', id, 'SYSTEM', 1, 1
FROM setting_categories WHERE name = 'Dashboard'
ON CONFLICT (key) DO NOTHING;

-- Privacy Settings
INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by)
SELECT 'privacy.analytics.enabled', 'true', 'Enable analytics tracking', id, 'SYSTEM', 1, 1
FROM setting_categories WHERE name = 'Privacy'
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by)
SELECT 'privacy.data.retention', '90', 'Data retention period in days', id, 'SYSTEM', 1, 1
FROM setting_categories WHERE name = 'Privacy'
ON CONFLICT (key) DO NOTHING;

-- Accessibility Settings
INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by)
SELECT 'accessibility.high.contrast', 'false', 'Enable high contrast mode', id, 'SYSTEM', 1, 1
FROM setting_categories WHERE name = 'Accessibility'
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by)
SELECT 'accessibility.font.size', 'medium', 'Default font size', id, 'SYSTEM', 1, 1
FROM setting_categories WHERE name = 'Accessibility'
ON CONFLICT (key) DO NOTHING;

-- Email Settings
INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by)
SELECT 'email.smtp.host', 'smtp.gmail.com', 'SMTP server host', id, 'SYSTEM', 1, 1
FROM setting_categories WHERE name = 'Email'
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by)
SELECT 'email.smtp.port', '587', 'SMTP server port', id, 'SYSTEM', 1, 1
FROM setting_categories WHERE name = 'Email'
ON CONFLICT (key) DO NOTHING;

-- API Settings
INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by)
SELECT 'api.rate.limit', '100', 'API rate limit per minute', id, 'SYSTEM', 1, 1
FROM setting_categories WHERE name = 'API'
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by)
SELECT 'api.timeout', '30000', 'API request timeout in milliseconds', id, 'SYSTEM', 1, 1
FROM setting_categories WHERE name = 'API'
ON CONFLICT (key) DO NOTHING;

SELECT 'Sample settings seeded successfully!' AS status;
SELECT COUNT(*) || ' settings created' AS count FROM settings;
