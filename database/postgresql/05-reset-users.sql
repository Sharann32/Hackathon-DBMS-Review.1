-- Reset users and create fresh ones
\c settings_db;

-- Delete existing users (this will cascade delete user_roles)
DELETE FROM users WHERE email IN ('admin@example.com', 'john@example.com', 'jane@example.com', 'bob@example.com');

-- Insert fresh users with BCrypt hashes
-- Admin password: admin123
-- User password: user123
INSERT INTO users (name, email, password, enabled, created_at, last_login) VALUES 
    ('Admin User', 'admin@example.com', '$2a$10$vPyGqtZH8urLKqF5kLvg6OH/cSb4/.7Hfyd0cP7zV8N9QjKQPxZ.u', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP - INTERVAL '5 minutes'),
    ('John Doe', 'john@example.com', '$2a$10$vPyGqtZH8urLKqF5kLvg6OH/cSb4/.7Hfyd0cP7zV8N9QjKQPxZ.u', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP - INTERVAL '2 hours'),
    ('Jane Smith', 'jane@example.com', '$2a$10$vPyGqtZH8urLKqF5kLvg6OH/cSb4/.7Hfyd0cP7zV8N9QjKQPxZ.u', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP - INTERVAL '1 day'),
    ('Bob Wilson', 'bob@example.com', '$2a$10$vPyGqtZH8urLKqF5kLvg6OH/cSb4/.7Hfyd0cP7zV8N9QjKQPxZ.u', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP - INTERVAL '3 days');

-- Assign roles
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'admin@example.com' AND r.role_name = 'ROLE_ADMIN';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email IN ('john@example.com', 'jane@example.com', 'bob@example.com') 
AND r.role_name = 'ROLE_USER';

SELECT 'Users reset successfully!' AS status;
SELECT id, name, email, enabled FROM users ORDER BY id;
