DROP DATABASE IF EXISTS SMART_CAMPUS_EVENT_PLANNER;
CREATE DATABASE SMART_CAMPUS_EVENT_PLANNER;
USE SMART_CAMPUS_EVENT_PLANNER;

CREATE TABLE users (
    user_id VARCHAR(100) PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin') NOT NULL DEFAULT 'student',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    category_id VARCHAR(100) PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE events (
    event_id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    category_id VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(150) NOT NULL,
    capacity INT NOT NULL,
    status ENUM('open', 'full', 'cancelled', 'completed', 'disabled') NOT NULL DEFAULT 'open',
    organizer_id VARCHAR(100) NOT NULL,
    created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (capacity > 0),
    CHECK (end_time > start_time),
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    FOREIGN KEY (organizer_id) REFERENCES users(user_id)
);

CREATE TABLE registrations (
    registration_id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    event_id VARCHAR(100) NOT NULL,
    registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status ENUM('registered', 'cancelled', 'attended', 'missed') NOT NULL DEFAULT 'registered',
    attended ENUM('yes', 'no') NOT NULL DEFAULT 'no',
    UNIQUE (user_id, event_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);