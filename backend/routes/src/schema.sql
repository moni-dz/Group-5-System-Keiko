CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS cards
(
    id uuid DEFAULT uuid_generate_v1() NOT NULL CONSTRAINT cards_pkey PRIMARY KEY,
    question text NOT NULL,
    answer text NOT NULL,
    course_code text NOT NULL,
    category text NOT NULL,
    created_at timestamp with time zone default CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone
);

CREATE TABLE IF NOT EXISTS courses
(
    id uuid DEFAULT uuid_generate_v1() NOT NULL CONSTRAINT courses_pkey PRIMARY KEY,
    name text NOT NULL,
    course_code text NOT NULL,
    description text NOT NULL,
    created_at timestamp with time zone default CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone
);

CREATE OR REPLACE VIEW courses_view AS
SELECT
    c.*,
    COALESCE(f.questions, 0) AS questions,
    CASE
        WHEN COALESCE(f.questions, 0) = 0 THEN 0
        ELSE ROUND((COALESCE(q.total_current_index, 0)::float / f.questions) * 100)::integer
    END AS progress
FROM
    courses c
LEFT JOIN (
    SELECT
        course_code,
        COUNT(*) AS questions
    FROM
        cards
    GROUP BY
        course_code
) f ON c.course_code = f.course_code
LEFT JOIN (
    SELECT
        course_code,
        SUM(current_index) AS total_current_index
    FROM
        quizzes
    GROUP BY
        course_code
) q ON c.course_code = q.course_code;

CREATE TABLE IF NOT EXISTS quizzes
(
    id uuid DEFAULT uuid_generate_v1() NOT NULL CONSTRAINT quiz_pkey PRIMARY KEY,
    course_code text NOT NULL,
    category text NOT NULL,
    current_index integer DEFAULT 0 NOT NULL,
    correct_count integer DEFAULT 0 NOT NULL,
    is_completed boolean DEFAULT false NOT NULL,
    started_at timestamp with time zone default CURRENT_TIMESTAMP NOT NULL,
    completed_at timestamp with time zone
);

/*
    SELECT * FROM quizzes_view;
    SELECT * FROM quizzes_view WHERE quiz_id = 'your_quiz_id_here';
*/
CREATE OR REPLACE VIEW quizzes_view AS
SELECT
    q.id AS quiz_id,
    q.course_code,
    q.category,
    q.current_index,
    q.is_completed,
    q.correct_count,
    q.started_at,
    q.completed_at,
    COUNT(f.id) AS card_count,
    CASE
        WHEN COUNT(f.id) = 0 THEN 0
        ELSE ROUND((q.current_index::float / COUNT(f.id)) * 100)::integer
    END AS progress
FROM
    quizzes q
LEFT JOIN
    cards f ON q.course_code = f.course_code AND q.category = f.category
GROUP BY
    q.id, q.course_code, q.category, q.current_index, q.is_completed, q.correct_count, q.started_at, q.completed_at;
