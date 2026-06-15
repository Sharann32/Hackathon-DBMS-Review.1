-- ================================================
-- Add More Sample Categories and Settings
-- Settings and Configuration Management System
-- ================================================

\c settings_db;

-- Add more categories if they don't exist
INSERT INTO setting_categories (name, description) VALUES 
    ('Performance', 'Performance optimization settings'),
    ('Backup', 'Backup and restore configurations'),
    ('Integration', 'Third-party integration settings'),
    ('Logging', 'Application logging preferences'),
    ('Network', 'Network and connectivity settings')
ON CONFLICT (name) DO NOTHING;

-- Get admin user ID for created_by
DO $$
DECLARE
    admin_id BIGINT;
    appearance_cat_id BIGINT;
    notification_cat_id BIGINT;
    security_cat_id BIGINT;
    localization_cat_id BIGINT;
    dashboard_cat_id BIGINT;
    privacy_cat_id BIGINT;
    email_cat_id BIGINT;
    general_cat_id BIGINT;
    performance_cat_id BIGINT;
    backup_cat_id BIGINT;
    integration_cat_id BIGINT;
    logging_cat_id BIGINT;
    network_cat_id BIGINT;
BEGIN
    -- Get admin user ID
    SELECT id INTO admin_id FROM users WHERE email = 'admin@example.com' LIMIT 1;
    
    -- Get category IDs
    SELECT id INTO appearance_cat_id FROM setting_categories WHERE name = 'Appearance' LIMIT 1;
    SELECT id INTO notification_cat_id FROM setting_categories WHERE name = 'Notifications' LIMIT 1;
    SELECT id INTO security_cat_id FROM setting_categories WHERE name = 'Security' LIMIT 1;
    SELECT id INTO localization_cat_id FROM setting_categories WHERE name = 'Localization' LIMIT 1;
    SELECT id INTO dashboard_cat_id FROM setting_categories WHERE name = 'Dashboard' LIMIT 1;
    SELECT id INTO privacy_cat_id FROM setting_categories WHERE name = 'Privacy' LIMIT 1;
    SELECT id INTO email_cat_id FROM setting_categories WHERE name = 'Email' LIMIT 1;
    SELECT id INTO general_cat_id FROM setting_categories WHERE name = 'General' LIMIT 1;
    SELECT id INTO performance_cat_id FROM setting_categories WHERE name = 'Performance' LIMIT 1;
    SELECT id INTO backup_cat_id FROM setting_categories WHERE name = 'Backup' LIMIT 1;
    SELECT id INTO integration_cat_id FROM setting_categories WHERE name = 'Integration' LIMIT 1;
    SELECT id INTO logging_cat_id FROM setting_categories WHERE name = 'Logging' LIMIT 1;
    SELECT id INTO network_cat_id FROM setting_categories WHERE name = 'Network' LIMIT 1;
    
    -- Appearance Settings
    INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by, created_at, updated_at)
    VALUES 
        ('app.theme.dark_mode_enabled', 'true', 'Enable dark mode support', appearance_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('app.theme.primary_color', '#3b82f6', 'Primary brand color', appearance_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('app.theme.accent_color', '#8b5cf6', 'Accent color for highlights', appearance_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('app.ui.animations_enabled', 'true', 'Enable UI animations', appearance_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT (key) DO NOTHING;
    
    -- Notification Settings
    INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by, created_at, updated_at)
    VALUES 
        ('notifications.push.enabled', 'true', 'Enable push notifications', notification_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('notifications.email.daily_digest', 'true', 'Send daily email digest', notification_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('notifications.sms.enabled', 'false', 'Enable SMS notifications', notification_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('notifications.alert.sound', 'enabled', 'Play sound on notifications', notification_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT (key) DO NOTHING;
    
    -- Security Settings
    INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by, created_at, updated_at)
    VALUES 
        ('security.password.min_length', '8', 'Minimum password length', security_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('security.password.require_uppercase', 'true', 'Require uppercase letters in password', security_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('security.password.require_numbers', 'true', 'Require numbers in password', security_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('security.password.require_special', 'false', 'Require special characters', security_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('security.two_factor.enabled', 'false', 'Enable two-factor authentication', security_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('security.login.max_attempts', '5', 'Maximum login attempts before lockout', security_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT (key) DO NOTHING;
    
    -- Localization Settings
    INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by, created_at, updated_at)
    VALUES 
        ('localization.default_language', 'en', 'Default application language', localization_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('localization.default_timezone', 'Asia/Kolkata', 'Default timezone', localization_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('localization.default_date_format', 'DD/MM/YYYY', 'Default date format', localization_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('localization.currency', 'INR', 'Default currency', localization_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT (key) DO NOTHING;
    
    -- Dashboard Settings
    INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by, created_at, updated_at)
    VALUES 
        ('dashboard.refresh_interval', '300', 'Dashboard auto-refresh interval (seconds)', dashboard_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('dashboard.show_welcome', 'true', 'Show welcome message', dashboard_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('dashboard.default_view', 'grid', 'Default dashboard layout', dashboard_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('dashboard.widgets_enabled', 'true', 'Enable dashboard widgets', dashboard_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT (key) DO NOTHING;
    
    -- Privacy Settings
    INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by, created_at, updated_at)
    VALUES 
        ('privacy.data_collection', 'minimal', 'Data collection level', privacy_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('privacy.analytics.enabled', 'true', 'Enable analytics tracking', privacy_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('privacy.cookies.essential_only', 'false', 'Use only essential cookies', privacy_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('privacy.profile_visibility', 'private', 'Default profile visibility', privacy_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT (key) DO NOTHING;
    
    -- Email Settings
    INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by, created_at, updated_at)
    VALUES 
        ('email.smtp.host', 'smtp.gmail.com', 'SMTP server host', email_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('email.smtp.port', '587', 'SMTP server port', email_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('email.from.address', 'noreply@settingsapp.com', 'Default sender email', email_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('email.from.name', 'Settings App', 'Default sender name', email_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT (key) DO NOTHING;
    
    -- General Settings
    INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by, created_at, updated_at)
    VALUES 
        ('app.name', 'Settings Management System', 'Application name', general_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('app.version', '1.0.0', 'Application version', general_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('app.maintenance_mode', 'false', 'Enable maintenance mode', general_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('app.registration.enabled', 'true', 'Allow new user registration', general_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT (key) DO NOTHING;
    
    -- Performance Settings
    INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by, created_at, updated_at)
    VALUES 
        ('performance.cache.enabled', 'true', 'Enable application caching', performance_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('performance.cache.ttl', '3600', 'Cache time-to-live (seconds)', performance_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('performance.compression.enabled', 'true', 'Enable response compression', performance_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('performance.lazy_loading', 'true', 'Enable lazy loading', performance_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT (key) DO NOTHING;
    
    -- Backup Settings
    INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by, created_at, updated_at)
    VALUES 
        ('backup.auto_backup', 'true', 'Enable automatic backups', backup_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('backup.frequency', 'daily', 'Backup frequency', backup_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('backup.retention_days', '30', 'Backup retention period (days)', backup_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('backup.storage_location', '/backups', 'Backup storage location', backup_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT (key) DO NOTHING;
    
    -- Integration Settings
    INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by, created_at, updated_at)
    VALUES 
        ('integration.api.enabled', 'true', 'Enable external API integrations', integration_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('integration.webhooks.enabled', 'true', 'Enable webhook notifications', integration_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('integration.oauth.google', 'false', 'Enable Google OAuth login', integration_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('integration.oauth.github', 'false', 'Enable GitHub OAuth login', integration_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT (key) DO NOTHING;
    
    -- Logging Settings
    INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by, created_at, updated_at)
    VALUES 
        ('logging.level', 'INFO', 'Application log level', logging_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('logging.file.enabled', 'true', 'Enable file logging', logging_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('logging.file.max_size', '10MB', 'Maximum log file size', logging_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('logging.retention_days', '90', 'Log retention period (days)', logging_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT (key) DO NOTHING;
    
    -- Network Settings
    INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by, created_at, updated_at)
    VALUES 
        ('network.timeout', '30', 'Network request timeout (seconds)', network_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('network.retry_attempts', '3', 'Number of retry attempts', network_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('network.proxy.enabled', 'false', 'Enable proxy server', network_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('network.ssl.verify', 'true', 'Verify SSL certificates', network_cat_id, 'SYSTEM', admin_id, admin_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT (key) DO NOTHING;
    
END $$;

-- Add last_login column to users table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'last_login') THEN
        ALTER TABLE users ADD COLUMN last_login TIMESTAMP;
    END IF;
END $$;

-- Update last_login for existing users (simulate recent logins)
UPDATE users SET last_login = CURRENT_TIMESTAMP - INTERVAL '5 minutes' WHERE email = 'admin@example.com';
UPDATE users SET last_login = CURRENT_TIMESTAMP - INTERVAL '2 hours' WHERE email = 'john@example.com';
UPDATE users SET last_login = CURRENT_TIMESTAMP - INTERVAL '1 day' WHERE email = 'jane@example.com';
UPDATE users SET last_login = CURRENT_TIMESTAMP - INTERVAL '3 days' WHERE email = 'bob@example.com';
UPDATE users SET last_login = CURRENT_TIMESTAMP - INTERVAL '1 week' WHERE email = 'dimpu@gmail.com';
UPDATE users SET last_login = CURRENT_TIMESTAMP - INTERVAL '2 weeks' WHERE email = 'saijeshwanth@gmail.com';

-- Success message
SELECT 'Sample data added successfully!' AS status;
SELECT COUNT(*) AS total_settings FROM settings;
SELECT COUNT(*) AS total_categories FROM setting_categories;
SELECT COUNT(*) AS total_users FROM users;
