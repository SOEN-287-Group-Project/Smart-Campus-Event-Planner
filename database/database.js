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

// get all registrations by user_id

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
        user_id,
        event_id
    )
    VALUES (?, ?)
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
const selectUserById = db.prepare(
    `
    SELECT user_id, full_name, email, role
    FROM users
    WHERE user_id = ?;
    `
);

const updateUserProfileById = db.prepare(
    `
    UPDATE users
    SET full_name = ?, email = ?
    WHERE user_id = ?;
    `
);

const selectUserPasswordById = db.prepare(
    `
    SELECT password_hash
    FROM users
    WHERE user_id = ?;
    `
);

const updateUserPasswordById = db.prepare(
    `
    UPDATE users
    SET password_hash = ?
    WHERE user_id = ?;
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
    JOIN users USING (user_id)
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
    SELECT 
        events.event_id,
        events.organizer_id,
        users.full_name,
        events.category_id,
        categories.category_name,
        events.title,
        events.description,
        events.event_date,
        events.start_time,
        events.end_time,
        events.location,
        events.capacity,
        events.status,
        events.created_on
    FROM events
    JOIN users ON events.organizer_id = users.user_id
    JOIN categories ON events.category_id = categories.category_id
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
    SELECT 
        registrations.registration_id,
        registrations.user_id,
        users.full_name,
        registrations.event_id,
        registrations.registration_date,
        registrations.attended
    FROM registrations
    JOIN users ON registrations.user_id = users.user_id;
    `
);
// ********** SQL Scripts for UPDATE **********

// sql script for updating an event by id
const updateEventById = db.prepare(`
    UPDATE events
    SET
        category_id = ?,
        title = ?,
        description = ?,
        event_date = ?,
        start_time = ?,
        end_time = ?,
        capacity = ?,
        location = ?,
        status = ?
    WHERE event_id = ?
`);

// sql script for update attendance by id
const updateAttendanceById = db.prepare(`
    UPDATE registrations
    SET attended = ?
    WHERE event_id = ?
      AND user_id = ?
`);

// ********** API Functions for adding one entry **********

// adding new user to the users table
function addUser(
    full_name, 
    email, 
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

function getUserById(userId) {
    return selectUserById.get(userId);
}

function updateUserProfile(userId, fullName, email) {
    return updateUserProfileById.run(
        fullName,
        email,
        userId
    );
}

function getUserPasswordById(userId) {
    return selectUserPasswordById.get(userId);
}

function updateUserPassword(userId, passwordHash) {
    return updateUserPasswordById.run(
        passwordHash,
        userId
    );
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

// getting all the users from the registrations table
function getAllRegistrations(){
    const result = selectAllFromRegistrations.all();
    return result;
}

// ********** API Functions for updating  **********

// updating an event by id
function updateEvent(
    event_id,
    category_id,
    title,
    description,
    event_date,
    start_time,
    end_time,
    capacity,
    location,
    status
) {
    const result = updateEventById.run(
        category_id,
        title,
        description,
        event_date,
        start_time,
        end_time,
        capacity,
        location,
        status,
        event_id
    );

    if (result.changes === 0) {
        return null;
    }
    
    // retrieve the updated event from the database
    // and return it to the route/frontend
    return db.prepare(`
        SELECT *
        FROM events
        WHERE event_id = ?
    `).get(event_id);
}


// Update a student's attendance for an event
function updateAttendance(
    event_id,
    user_id,
    attended
) {
    const result = updateAttendanceById.run(
        attended,
        event_id,
        user_id
    );

    if (result.changes === 0) {
        return null;
    }

    // Retrieve the updated attendance record
    // and return it to the route/frontend
    return db.prepare(`
        SELECT *
        FROM registrations
        WHERE event_id = ?
          AND user_id = ?
    `).get(event_id, user_id);
}
/* ------------- STUDENT API FUNCTIONS ------------- */

function getRegistrationRowsForUser(userId) {
    return db
      .prepare(`SELECT * FROM registrations WHERE user_id = ?`)
      .all(String(userId));
  }

function getCategoryById(categoryId) {
    return db
      .prepare(`SELECT * FROM categories WHERE category_id = ?`)
      .get(categoryId);
  }

function getEventById(eventId) {
    return db
        .prepare(`SELECT * FROM events WHERE event_id = ?`)
        .get(eventId);
}

function getRegistrationsForUser(userId) {
    const registrations = getRegistrationRowsForUser(userId); //get all registrations for a user
    const data = registrations.map((registration) => { //map through the registrations and return the registration id, user id, event id, attended, title, date, status, and category name
        const event = getEventById(registration.event_id); // search through event table for the event javascript object
        const category = getCategoryById(event.category_id); // search through category table for the category javascript object
        return {
            registration_id: registration.registration_id,
            user_id: registration.user_id,
            event_id: registration.event_id,
            attended: registration.attended,
            title: event.title, 
            date: event.event_date,
            status: event.status,
            category_name: category.category_name
        };
    });
    return data;
}

// ********** Get counts **********

function getCountOfStudents(){
    const result = db.prepare(
        `
        SELECT COUNT(*) AS student_count
        FROM users
        WHERE role = 'student'
        `
    ).get();
    return result;
}

function getCountOfEvents(){
    const result = db.prepare(
        `
        SELECT COUNT(*) AS event_count
        FROM events
        `
    ).get();
    return result;
}

function getCountOfRegistrationsByEvent(event_id){
    const result = db.prepare(
        `
        SELECT COUNT(*) AS registration_count
        FROM registrations
        WHERE event_id = ?
        `
    ).get(event_id);
    return result;
}

// ********** Exports **********
export default{
    addUser,
    addCategory,
    addEvents,
    addRegistration,
    getUser,
    
    getUserById,
    updateUserProfile,
    getUserPasswordById,
    updateUserPassword,

    getCategory,
    getEvent,
    getRegistration,
    getRegistrationByStudent,
    getAllUsers,
    getAllCategories,
    getAllEvent,
    getAllRegistrations,

    updateEvent,
    updateAttendance,

    getRegistrationsForUser,

    getCountOfEvents,
    getCountOfRegistrationsByEvent,
    getCountOfStudents
}
