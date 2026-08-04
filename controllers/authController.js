import { createUser } from "../database/database.js";

function login(){

}

function logout(){

}

function register(){
    const {
        first_name,
        last_name,
        email,
        password,
        confirmed_password
    } = req.body;

    if (password === confirmed_password) {
        return;
    }

    createUser(first_name + last_name, email, password);
}

export {
    login,
    register
}