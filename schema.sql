-- SkillNest: EdTech platform database (MySQL 8 / MariaDB 10.5+)
-- Run: mysql -u root -p < schema.sql

DROP DATABASE IF EXISTS skillnest;
CREATE DATABASE skillnest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE skillnest;

-- Learners and admins
CREATE TABLE users (
    user_id        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name      VARCHAR(100) NOT NULL,
    email          VARCHAR(150) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,          -- store bcrypt hash, never plain text
    role           ENUM('student','admin') NOT NULL DEFAULT 'student',
    created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Subject areas: Web Development, Databases, ...
CREATE TABLE categories (
    category_id    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(80) NOT NULL UNIQUE,
    description    VARCHAR(255)
) ENGINE=InnoDB;

-- Teachers / channels the videos come from
CREATE TABLE instructors (
    instructor_id  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(100) NOT NULL,
    channel_name   VARCHAR(100),
    channel_url    VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE courses (
    course_id      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title          VARCHAR(150) NOT NULL,
    description    TEXT,
    category_id    INT UNSIGNED NOT NULL,
    level          ENUM('beginner','intermediate','advanced') NOT NULL DEFAULT 'beginner',
    thumbnail_url  VARCHAR(255),
    is_published   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_course_category FOREIGN KEY (category_id) REFERENCES categories(category_id),
    INDEX idx_course_category (category_id)
) ENGINE=InnoDB;

-- Each video belongs to one course and has an order inside it
CREATE TABLE videos (
    video_id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    course_id         INT UNSIGNED NOT NULL,
    instructor_id     INT UNSIGNED NOT NULL,
    title             VARCHAR(200) NOT NULL,
    video_url         VARCHAR(255) NOT NULL,        -- full YouTube link
    youtube_id        VARCHAR(20)  NOT NULL,        -- handy for embeds: youtube.com/embed/<id>
    duration_seconds  INT UNSIGNED NOT NULL,
    position          SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    CONSTRAINT fk_video_course     FOREIGN KEY (course_id)     REFERENCES courses(course_id)         ON DELETE CASCADE,
    CONSTRAINT fk_video_instructor FOREIGN KEY (instructor_id) REFERENCES instructors(instructor_id),
    UNIQUE KEY uq_course_position (course_id, position),
    UNIQUE KEY uq_youtube_id (youtube_id)
) ENGINE=InnoDB;

-- Which student joined which course
CREATE TABLE enrollments (
    user_id      INT UNSIGNED NOT NULL,
    course_id    INT UNSIGNED NOT NULL,
    enrolled_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, course_id),
    CONSTRAINT fk_enr_user   FOREIGN KEY (user_id)   REFERENCES users(user_id)     ON DELETE CASCADE,
    CONSTRAINT fk_enr_course FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Resume-watching and completion tracking
CREATE TABLE video_progress (
    user_id          INT UNSIGNED NOT NULL,
    video_id         INT UNSIGNED NOT NULL,
    watched_seconds  INT UNSIGNED NOT NULL DEFAULT 0,
    completed        BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, video_id),
    CONSTRAINT fk_prog_user  FOREIGN KEY (user_id)  REFERENCES users(user_id)   ON DELETE CASCADE,
    CONSTRAINT fk_prog_video FOREIGN KEY (video_id) REFERENCES videos(video_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- One rating per student per course
CREATE TABLE reviews (
    user_id     INT UNSIGNED NOT NULL,
    course_id   INT UNSIGNED NOT NULL,
    rating      TINYINT UNSIGNED NOT NULL,
    comment     VARCHAR(500),
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, course_id),
    CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT fk_rev_user   FOREIGN KEY (user_id)   REFERENCES users(user_id)     ON DELETE CASCADE,
    CONSTRAINT fk_rev_course FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
) ENGINE=InnoDB;
