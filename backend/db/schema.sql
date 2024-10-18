CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS flashcards
(
    id uuid DEFAULT uuid_generate_v1() NOT NULL CONSTRAINT flashcards_pkey PRIMARY KEY,
    question text NOT NULL,
    answer text NOT NULL,
    difficulty text NOT NULL,
    tags text[] NOT NULL,
    created_at timestamp with time zone default CURRENT_TIMESTAMP,
    updated_at timestamp with time zone
);

CREATE TABLE IF NOT EXISTS courses
(
    name text NOT NULL CONSTRAINT courses_pkey PRIMARY KEY,
    long_name text NOT NULL,
    progress integer DEFAULT 0 NOT NULL,
    is_completed boolean DEFAULT false NOT NULL,
    completion_date timestamp with time zone,
);
