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
    course_code text NOT NULL CONSTRAINT courses_course_code_key UNIQUE,
    description text NOT NULL,
    created_at timestamp with time zone default CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone
);

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

CREATE OR REPLACE VIEW courses_view AS
SELECT
    c.*,
    COALESCE(f.questions, 0) AS questions,
    CASE
        WHEN COALESCE(q.total_quizzes, 0) = 0 THEN 0
        ELSE ROUND((COALESCE(q.completed_quizzes, 0)::float / q.total_quizzes) * 100)::integer
    END AS progress,
    COALESCE(cat.categories, ARRAY[]::text[]) AS categories
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
        COUNT(*) AS total_quizzes,
        COUNT(CASE WHEN is_completed THEN 1 END) AS completed_quizzes
    FROM
        quizzes
    GROUP BY
        course_code
) q ON c.course_code = q.course_code
LEFT JOIN (
    SELECT
        course_code,
        ARRAY_AGG(DISTINCT category) AS categories
    FROM
        quizzes
    GROUP BY
        course_code
) cat ON c.course_code = cat.course_code;

CREATE OR REPLACE VIEW quizzes_view AS
SELECT
    q.*,
    COALESCE(COUNT(f.id), 0) AS card_count,
    CASE
        WHEN q.is_completed THEN 100
        WHEN COUNT(f.id) = 0 THEN 0
        ELSE ROUND((q.current_index::float / COUNT(f.id)) * 100)::integer
    END AS progress
FROM
    quizzes q
LEFT JOIN
    cards f ON q.course_code = f.course_code AND q.category = f.category
GROUP BY
    q.id, q.course_code, q.category, q.current_index, q.is_completed, q.correct_count, q.started_at, q.completed_at;

CREATE OR REPLACE FUNCTION update_category(
    p_course_code TEXT,
    p_old_category TEXT,
    p_new_category TEXT
)
RETURNS void AS $$
BEGIN
    UPDATE cards
    SET category = p_new_category
    WHERE course_code = p_course_code
    AND category = p_old_category;

    UPDATE quizzes
    SET category = p_new_category
    WHERE course_code = p_course_code
    AND category = p_old_category;
END;
$$ LANGUAGE plpgsql;
