import fs from 'fs'
import bcrypt from 'bcrypt'
import Database from "better-sqlite3";

// initialize the database
const db = new Database("database/database.db");

// initialize the schemas
const sql = fs.readFileSync("./database/structure.sql", "utf8")

// create the tables if not exist
db.exec(sql)

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

// sql script for getting a user by unique email
const selectFromUsersByEmail = db.prepare(
    `
    SELECT *
    FROM users
    WHERE email = ?;
    `
);

// adding new user to the database
function insertUser(full_name, email, password_hash){
    const result = insertIntoUsers.run(
        full_name, 
        email, 
        password_hash
    );
    return result;
}

function getUser(email, password){
    const result = selectFromUsersByEmail.get(
        email
    );
    return result;
}

const selectAllFromEvents = db.prepare(
    `
    SELECT *
    FROM events;
    `
);

function getAllEvent(){
    const result = selectAllFromEvents.all();
    return result;
}

export{
    insertUser,
    getUser,
    getAllEvent
}
