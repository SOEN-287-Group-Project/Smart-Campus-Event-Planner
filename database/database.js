import fs from 'fs'
import Database from "better-sqlite3";

const db = new Database("database.db");

const sql = fs.readFileSync("./database/structure.sql", "utf8")

db.exec(sql)

//user_id, full_name, email, password_hash, role, created_at

// adding new user to the database using INSERT

function createUser(full_name, email, password_hash){
    const result = db.prepare(
        `
        INSERT INTO users(full_name, email, password_hash)
        VALUES (?, ?, ?, ?, ?,)
        `
    ).run(
        full_name, 
        email, 
        password_hash
    );
    return result;
}

export{
    createUser
}