import { createUser } from "../database/database.js";

function login(req, res){

}

function logout(req, res){

}

function register(req, res){
    const {
        first_name,
        last_name,
        email,
        password,
        confirmed_password
    } = req.body;

    if (!first_name || !last_name || !email || !password || !confirmed_password) {
        return res.status(400).send("All fields are required.");
    }

    if (password !== confirmed_password) {
        return res.status(400).send("Passwords do not match.");
    }

    try {
        createUser(`${first_name} ${last_name}`, email, password);
        return res.redirect('/student-dashboard');
    } catch (error) {
        if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return res.status(409).send("An account with this email already exists.");
        }
        console.error(error);
        return res.status(500).send("Unable to create account.");
    }
}

function signin(req, res){
    const {
        email,
        password
    } = res.body;

    if (!email || !password) {
        return res.status(400).send("All fields are required.");
    }

    
    
}

export {
    login,
    register
}
