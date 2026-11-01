-- SkillNest sample data. Run after schema.sql:  mysql -u root -p skillnest < seed.sql
-- Video links point to public freeCodeCamp.org YouTube courses.
USE skillnest;

INSERT INTO users (full_name, email, password_hash, role) VALUES
('Admin SkillNest',  'admin@skillnest.dev',  '$2b$10$REPLACE_WITH_REAL_BCRYPT_HASH_ADMIN',  'admin'),
('Demo Student One', 'student1@skillnest.dev','$2b$10$REPLACE_WITH_REAL_BCRYPT_HASH_ONE',   'student'),
('Demo Student Two', 'student2@skillnest.dev','$2b$10$REPLACE_WITH_REAL_BCRYPT_HASH_TWO',   'student');

INSERT INTO categories (name, description) VALUES
('Web Development',      'HTML, CSS, JavaScript and modern frontend frameworks'),
('Databases',            'SQL, MySQL and database design'),
('Programming',          'Core programming languages for beginners'),
('Placement Preparation','Data structures and algorithms for interviews');

INSERT INTO instructors (name, channel_name, channel_url) VALUES
('freeCodeCamp.org', 'freeCodeCamp.org', 'https://www.youtube.com/@freecodecamp');

INSERT INTO courses (title, description, category_id, level, thumbnail_url) VALUES
('HTML & CSS Foundations',   'Build websites from scratch with HTML and CSS.',                         1, 'beginner',     NULL),
('Learn React',              'Modern React fundamentals through hands-on projects.',                   1, 'intermediate', NULL),
('SQL & MySQL Essentials',   'Relational database basics, queries, data modeling and indexes.',        2, 'beginner',     NULL),
('Python for Beginners',     'Start programming in Python, no prior experience needed.',               3, 'beginner',     NULL),
('DSA for Placements',       'Algorithms and data structures to prepare for technical interviews.',    4, 'intermediate', NULL);

-- instructor_id 1 = freeCodeCamp.org
INSERT INTO videos (course_id, instructor_id, title, video_url, youtube_id, duration_seconds, position) VALUES
(1, 1, 'Learn HTML & CSS – Full Course for Beginners',
   'https://www.youtube.com/watch?v=a_iQb1lnAEQ', 'a_iQb1lnAEQ', 19304, 1),
(2, 1, 'React Course – Beginner''s Tutorial for React JavaScript Library',
   'https://www.youtube.com/watch?v=bMknfKXIFA8', 'bMknfKXIFA8', 42927, 1),
(2, 1, 'Full Stack React Developer Course with Appwrite',
   'https://www.youtube.com/watch?v=Bvwq_S0n2pk', 'Bvwq_S0n2pk', 45610, 2),
(3, 1, 'SQL Tutorial – Full Database Course for Beginners',
   'https://www.youtube.com/watch?v=HXV3zeQKqGY', 'HXV3zeQKqGY', 15639, 1),
(3, 1, 'MySQL Database – Full Course',
   'https://www.youtube.com/watch?v=ER8oKX5myE0', 'ER8oKX5myE0', 7171, 2),
(4, 1, 'Learn Python – Full Course for Beginners',
   'https://www.youtube.com/watch?v=rfscVS0vtbw', 'rfscVS0vtbw', 16012, 1),
(4, 1, 'Python for Beginners – Full Course',
   'https://www.youtube.com/watch?v=eWRfhZUzrAc', 'eWRfhZUzrAc', 16800, 2),
(5, 1, 'Algorithms and Data Structures Tutorial – Full Course for Beginners',
   'https://www.youtube.com/watch?v=8hly31xKli0', '8hly31xKli0', 19328, 1),
(5, 1, 'Data Structures and Algorithms in JavaScript – Full Course for Beginners',
   'https://www.youtube.com/watch?v=t2CEgPsws3U', 't2CEgPsws3U', 6775, 2);

INSERT INTO enrollments (user_id, course_id) VALUES
(2, 1), (2, 3), (2, 5),
(3, 2), (3, 4);

INSERT INTO video_progress (user_id, video_id, watched_seconds, completed) VALUES
(2, 1, 19304, TRUE),
(2, 4, 5200,  FALSE),
(3, 2, 1800,  FALSE);

INSERT INTO reviews (user_id, course_id, rating, comment) VALUES
(2, 1, 5, 'Clear and beginner friendly.'),
(3, 4, 4, 'Good pace, nice examples.');
