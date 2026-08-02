import { createUser } from "../database/database.js";

function showLogin(req, res){
    res.render("login.html", {root: "views"});
} 

function showRegister(req, res){
    res.sendFile("register.html", {root: "views"});
}

function login(req, res){

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

function logout(){

}

export {
    showLogin,
    showRegister,
    login,
    register
}