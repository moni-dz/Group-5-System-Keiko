CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS flashcards
(
    id uuid DEFAULT uuid_generate_v1() NOT NULL CONSTRAINT flashcards_pkey PRIMARY KEY,
    question text NOT NULL,
    answer text NOT NULL,
    course_code text NOT NULL,
    created_at timestamp with time zone default CURRENT_TIMESTAMP,
    updated_at timestamp with time zone
);

CREATE TABLE IF NOT EXISTS courses
(
    id uuid DEFAULT uuid_generate_v1() NOT NULL CONSTRAINT courses_pkey PRIMARY KEY,
    name text NOT NULL,
    course_code text NOT NULL,
    description text NOT NULL,
    progress integer DEFAULT 0 NOT NULL,
    is_completed boolean DEFAULT false NOT NULL,
    completion_date timestamp with time zone,
    created_at timestamp with time zone default CURRENT_TIMESTAMP,
    updated_at timestamp with time zone
);

CREATE OR REPLACE VIEW courses_with_flashcard_count AS
SELECT
    c.*,
    COALESCE(f.questions, 0) AS questions
FROM
    courses c
LEFT JOIN (
    SELECT
        course_code,
        COUNT(*) AS questions
    FROM
        flashcards
    GROUP BY
        course_code
) f ON c.course_code = f.course_code;
