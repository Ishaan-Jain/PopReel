CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE users (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,  -- Securely hashed password
    country VARCHAR(100),  -- User's country
    city VARCHAR(100),  -- User's city
    interests TEXT[],  -- Array of user interests (e.g., ['Sports', 'Movies'])
    onboarding_done BOOLEAN DEFAULT FALSE,  -- Flag for onboarding completion
    embedding vector(768)
);

