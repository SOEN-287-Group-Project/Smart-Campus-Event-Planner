DROP DATABASE IF EXISTS SMART_CAMPUS_EVENT_PLANNER;
CREATE DATABASE SMART_CAMPUS_EVENT_PLANNER;
USE SMART_CAMPUS_EVENT_PLANNER;

CREATE TABLE user (
	user_id varchar(100) PRIMARY KEY,
    first_name varchar(100),
    last_name varchar(100),
    email varchar(100),
    password varchar(100),
    role ENUM('student', 'admin') NOT NULL DEFAULT 'student',
    creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event (
	event_id varchar(100) PRIMARY KEY,
    title varchar(100),
    description varchar(100),
    category varchar(100),
    event_date DATE,
    start_time TIME,
    end_time TIME,
    location varchar(100),
    capacity INT,
    status Enum(
			'Academic workshops',
			'Career events',
            'Club activities',
            'Sports events',
            'Cultural events',
            'Volunteering events',
            'Social events',
            'Guest lectures',
            'Networking events',
            'Other'),
    organizer_id varchar(100),
    created_on DATE
);

CREATE TABLE registration (
	registration_id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100),
    event_id VARCHAR(100),
    registration_date DATE,
    status VARCHAR(100),
    attended Enum('yes', 'no')
);

CREATE TABLE category(
	category_id VARCHAR(100) PRIMARY KEY,
    catergory_name VARCHAR(100),
    description VARCHAR(100)
);