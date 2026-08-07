INSERT INTO users(
    user_id,
    full_name,
    email,
    password_hash,
    role
) VALUES
/* the hashed passwords are: password123*/
('1000', 'admin',               'admin@mail.concordia.ca',          '$2b$10$jyptYFllWfwCj/OzCcnBi.4ZNWr//10P1kzy4ybVOs9FbmOg7Rh4C', 'admin'),
('1001', 'Jason Shan',          'zijin.shan@mail.concordia.ca',     '$2b$10$jyptYFllWfwCj/OzCcnBi.4ZNWr//10P1kzy4ybVOs9FbmOg7Rh4C', 'student'),
('1002', 'Loic Duchesne Hamel', 'loicduchesnehamel@gmail.com',      '$2b$10$jyptYFllWfwCj/OzCcnBi.4ZNWr//10P1kzy4ybVOs9FbmOg7Rh4C', 'student'),
('1003', 'Kerollos Kerollos',   'kerollos.kerollos04@gmail.com',    '$2b$10$jyptYFllWfwCj/OzCcnBi.4ZNWr//10P1kzy4ybVOs9FbmOg7Rh4C', 'student'),
('1004', 'Matthew Pietroniro',  'matt181888@gmail.com',             '$2b$10$jyptYFllWfwCj/OzCcnBi.4ZNWr//10P1kzy4ybVOs9FbmOg7Rh4C', 'student'),
('1005', 'Edward Shamoun',      'shamoun.edward@gmail.com',         '$2b$10$jyptYFllWfwCj/OzCcnBi.4ZNWr//10P1kzy4ybVOs9FbmOg7Rh4C', 'student');