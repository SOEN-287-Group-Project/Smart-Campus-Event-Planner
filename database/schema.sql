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
    status 
		Enum(
			'Academic workshops',
			'Career events',
            'Club activities',
        ),
    organizer_id varchar(100),
                
            
            
            Sports events
            Cultural events
            Volunteering events
            Social events
            Guest lectures
            Networking events
            Other
    created_on DATE
);

# Unique user ID
# User full name
# User email
# Hashed password
# student or admin
# Account creation date
# user_id full_name email password_hash role created_at 