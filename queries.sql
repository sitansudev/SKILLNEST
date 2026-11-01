-- Sample queries your backend teammates can reuse (and you can demo tomorrow)
USE skillnest;

-- 1. Course catalogue with category, video count and total hours
SELECT c.course_id, c.title, cat.name AS category, c.level,
       COUNT(v.video_id) AS videos,
       ROUND(SUM(v.duration_seconds)/3600, 1) AS total_hours
FROM courses c
JOIN categories cat ON cat.category_id = c.category_id
LEFT JOIN videos v ON v.course_id = c.course_id
WHERE c.is_published = TRUE
GROUP BY c.course_id, c.title, cat.name, c.level;

-- 2. All videos of one course, in order (course_id = 3)
SELECT v.position, v.title, v.video_url, v.duration_seconds
FROM videos v
WHERE v.course_id = 3
ORDER BY v.position;

-- 3. A student's enrolled courses
SELECT u.full_name, c.title, e.enrolled_at
FROM enrollments e
JOIN users u   ON u.user_id   = e.user_id
JOIN courses c ON c.course_id = e.course_id
WHERE u.email = 'student1@skillnest.dev';

-- 4. Course completion percentage per student per course
SELECT u.full_name, c.title,
       ROUND(100 * COALESCE(SUM(p.watched_seconds), 0) / SUM(v.duration_seconds), 1) AS percent_watched
FROM enrollments e
JOIN users u   ON u.user_id   = e.user_id
JOIN courses c ON c.course_id = e.course_id
JOIN videos v  ON v.course_id = c.course_id
LEFT JOIN video_progress p ON p.video_id = v.video_id AND p.user_id = e.user_id
GROUP BY u.full_name, c.title;

-- 5. Average rating per course
SELECT c.title, ROUND(AVG(r.rating), 2) AS avg_rating, COUNT(*) AS reviews
FROM reviews r
JOIN courses c ON c.course_id = r.course_id
GROUP BY c.title;

-- 6. Search courses and videos by keyword
SELECT 'course' AS type, title FROM courses WHERE title LIKE '%python%'
UNION
SELECT 'video', title FROM videos WHERE title LIKE '%python%';
