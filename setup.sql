-- Run this in psql or pgAdmin to set up the database

CREATE DATABASE ai_solutions;

-- Then connect to the database:  \c ai_solutions

CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inquiries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    job_title VARCHAR(100) NOT NULL,
    job_details TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- After running this file, run: node scripts/createAdmin.js
-- to create your admin account.
