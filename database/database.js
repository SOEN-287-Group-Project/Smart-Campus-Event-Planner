import Database from "better-sqlite3";

const db = new Database("database.db");

const users = db.prepare(

    "SELECT * FROM users"

).all();

export{
    
}