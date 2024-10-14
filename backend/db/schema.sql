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
