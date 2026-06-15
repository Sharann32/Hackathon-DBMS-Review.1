-- ================================================
-- RBAC Seed Script with Test Users
-- Settings and Configuration Management System
-- ================================================

\c settings_db;

-- Insert roles if not exists
INSERT INTO roles (role_name) VALUES 
    ('ROLE_ADMIN'),
    ('ROLE_USER')
ON CONFLICT (role_name) DO NOTHING;

-- Insert test ADMIN user
-- Password: admin123 (BCrypt encoded)
INSERT INTO users (name, email, password, enabled, created_at) VALUES 
    ('Admin User', 'admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- Insert test REGULAR users
-- Password: user123 (BCrypt encoded)
INSERT INTO users (name, email, password, enabled, created_at) VALUES 
    ('John Doe', 'john@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE, CURRENT_TIMESTAMP),
    ('Jane Smith', 'jane@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE, CURRENT_TIMESTAMP),
    ('Bob Wilson', 'bob@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- Assign ROLE_ADMIN to admin user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'admin@example.com' AND r.role_name = 'ROLE_ADMIN'
ON CONFLICT DO NOTHING;

-- Assign ROLE_USER to regular users
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email IN ('john@example.com', 'jane@example.com', 'bob@example.com') 
AND r.role_name = 'ROLE_USER'
ON CONFLICT DO NOTHING;

-- Create default preferences for all users
-- Skip if user_preferences table doesn't exist yet

-- Insert sample system settings (created by admin)
INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by, created_at, updated_at)
SELECT 
    'app.theme.default', 
    'light', 
    'Default application theme',
    (SELECT id FROM setting_categories WHERE name = 'Appearance' LIMIT 1),
    'SYSTEM',
    (SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1),
    (SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE key = 'app.theme.default');

INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by, created_at, updated_at)
SELECT 
    'notifications.email.enabled', 
    'true', 
    'Enable email notifications system-wide',
    (SELECT id FROM setting_categories WHERE name = 'Notifications' LIMIT 1),
    'SYSTEM',
    (SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1),
    (SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE key = 'notifications.email.enabled');

INSERT INTO settings (key, value, description, category_id, scope, created_by, updated_by, created_at, updated_at)
SELECT 
    'security.session.timeout', 
    '3600', 
    'Session timeout in seconds',
    (SELECT id FROM setting_categories WHERE name = 'Security' LIMIT 1),
    'SYSTEM',
    (SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1),
    (SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE key = 'security.session.timeout');

-- Success message
SELECT 'RBAC seed data created successfully!' AS status;
SELECT '============================================' AS separator;
SELECT 'TEST CREDENTIALS' AS info;
SELECT '============================================' AS separator;
SELECT 'ADMIN User:' AS role, 'Email: admin@example.com' AS credentials, 'Password: admin123' AS password;
SELECT 'USER 1:' AS role, 'Email: john@example.com' AS credentials, 'Password: user123' AS password;
SELECT 'USER 2:' AS role, 'Email: jane@example.com' AS credentials, 'Password: user123' AS password;
SELECT 'USER 3:' AS role, 'Email: bob@example.com' AS credentials, 'Password: user123' AS password;

-- Display role assignments
SELECT 
    u.name AS user_name,
    u.email,
    r.role_name
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
ORDER BY r.role_name, u.name;
