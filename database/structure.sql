-- Database Definition --

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS registration;

CREATE TABLE users (
    user_id VARCHAR(100) PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL DEFAULT 'student' CHECK(role IN ('student', 'admin')) ,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    category_id VARCHAR(100) PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE events (
    event_id VARCHAR(100) PRIMARY KEY,
    organizer_id VARCHAR(100) NOT NULL,
    category_id VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(150) NOT NULL,
    capacity INT NOT NULL,
    status VARCHAR(100) NOT NULL DEFAULT 'open' CHECK(status IN ('open', 'full', 'cancelled', 'completed', 'disabled')),
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
    attended VARCHAR(10) NOT NULL DEFAULT 'no' CHECK(attended IN ('yes', 'no')) ,
    UNIQUE (user_id, event_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);