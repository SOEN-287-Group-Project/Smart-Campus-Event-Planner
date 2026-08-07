import fs from 'fs'
import bcrypt from 'bcrypt'
import Database from "better-sqlite3";

// initialize the database
const db = new Database("database/database.db");

// initialize the schemas
const schemas = fs.readFileSync("./database/schemas.sql", "utf8");

// initialize the users
const users = fs.readFileSync("./database/users.sql", "utf8");

// initialize the categories
const categories = fs.readFileSync("./database/categories.sql", "utf8");

// initialize the events
const events = fs.readFileSync("./database/events.sql", "utf8");

// initialize the registrations
const registrations = fs.readFileSync("./database/registrations.sql", "utf8");

// execute the sql scripts
db.exec(schemas);
db.exec(users);
db.exec(categories);
db.exec(events);
db.exec(registrations);

// ********** SQL Scripts summary **********

// INSERT (one)
// add (one) into users
// add (one) into categories
// add (one) into events
// add (one) into registrations

// SECLECT (one)
// get (one) from users by email
// get (one) from categories by category_name
// get (one) from events by title
// get (one) from registrations by registration_id

// SELECT (all)
// get (all) from users
// get (all) from categories
// get (all) from events
// get (all) from registrations

// ********** SQL Scripts for INSERT **********

// sql script for inserting to users
const insertIntoUsers = db.prepare(
    `
    INSERT INTO users(
        full_name, email, 
        password_hash
    )
    VALUES (?, ?, ?);
    `
);

// sql script for inserting to categories
const insertIntoCategories = db.prepare(
    `
    INSERT INTO categories(
        category_name, 
        description
    )
    VALUES (?, ?);
    `
);

// sql script for inserting to events
const insertIntoEvents = db.prepare(
    `
    INSERT INTO events(
        event_id,
        organizer_id,
        category_id,
        title, 
        description,
        event_date,
        start_time,
        end_time,
        location,
        capacity
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
);

// sql script for inserting to registrtation
const insertIntoRegistrations = db.prepare(
    `
    INSERT INTO registrations(
        registration_id,
        user_id,
        event_id
    )
    VALUES (?, ?, ?)
    `
);

// ********** SQL Scripts for SELECT with condition **********

// sql script for getting a user by unique email
const selectFromUsersByEmail = db.prepare(
    `
    SELECT *
    FROM users
    WHERE email = ?;
    `
);

// sql script for getting a category by unique category name
const selectFromCategoryByCategoryName = db.prepare(
    `
    SELECT *
    FROM categories
    WHERE category_name = ?;
    `
);

// sql script for getting a user by unique email
const selectFromEventsByEventTitle = db.prepare(
    `
    SELECT *
    FROM events
    WHERE title = ?;
    `
);

// sql script for getting a user by unique email
const selectFromRegistrationByEvents = db.prepare(
    `
    SELECT *
    FROM registrations
    WHERE registration_id = ?;
    `
);

// sql script for getting registrations by user_id
const selectFromRegistrationByUserId = db.prepare(
    `
    SELECT *
    FROM registrations
    JOIN registrations USING (user_id)
    `
);

// ********** SQL Scripts for SELECT all **********

// sql script for getting all users
const selectAllFromUsers = db.prepare(
    `
    SELECT *
    FROM users
    `
);

// sql script for getting all events
const selectAllFromEvents = db.prepare(
    `
    SELECT *
    FROM events;
    `
);

// sql script for getting all categories
const selectAllFromCategories = db.prepare(
    `
    SELECT *
    FROM categories;
    `
);

// sql script for getting all registration
const selectAllFromRegistrations = db.prepare(
    `
    SELECT *
    FROM registrations;
    `
);

// ********** API Functions for adding one entry **********

// adding new user to the users table
function addUser(
    full_name, email, 
    password_hash
){
    const result = insertIntoUsers.run(
        full_name, 
        email, 
        password_hash
    );
    return result;
}

// adding new category to the category table
function addCategory(
    category_name, 
    description
){
    const result = insertIntoCategories.run(
        category_name,
        description
    );
    return result;
}

// adding new category to the category table
function addEvents(
    organizer_id,
    category_id,
    title,
    description,
    event_date,
    start_time,
    end_time,
    location,
    capacity,
    status
){
    const result = insertIntoEvents.run(
        organizer_id,
        category_id,
        title,
        description,
        event_date,
        start_time,
        end_time,
        location,
        capacity,
        status
    );
    return result;
}

// adding new category to the category table
function addRegistration(
    user_id,
    event_id,
    attended
){
    const result = insertIntoRegistrations.run(
        user_id,
        event_id,
        attended
    );
    return result;
}

// ********** API Functions for getting one entry  **********

function getUser(email, password){
    const result = selectFromUsersByEmail.get(
        email
    );
    return result;
}

function getCategory(category_name){
    const result = selectFromCategoryByCategoryName.get(
        category_name
    );
    return result;
}

function getEvent(event_id){
    const result = selectFromEventsByEventTitle.get(
        title
    );
    return result;
}

function getRegistration(registration_id){
    const result = selectFromRegistrationByEvents.get(
        registration_id
    );
    return result;
}

function getRegistrationByStudent(registration_id){
    const result = selectFromRegistrationByUserId.all(
        user_id
    );
    return result;
}


// ********** API Functions for getting all entries **********

// getting all the users from the users table
function getAllUsers(){
    const result = selectAllFromUsers.all();
    return result;
}

// getting all the users from the users table
function getAllCategories(){
    const result = selectAllFromUsers.all();
    return result;
}

// get all the events from the events table
function getAllEvent(){
    const result = selectAllFromEvents.all();
    return result;
}

// getting all the users from the users table
function getAllRegistrations(){
    const result = selectAllFromUsers.all();
    return result;
}

// ********** Exports **********
export default{
    addUser,
    addCategory,
    addEvents,
    addRegistration,
    getUser,
    getCategory,
    getEvent,
    getRegistration,
    getRegistrationByStudent,
    getAllUsers,
    getAllCategories,
    getAllEvent,
    getAllRegistrations
}
