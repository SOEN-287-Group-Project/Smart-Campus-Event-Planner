import express from "express";
import {
    showLogin, 
    showRegister, 
    login, 
    register
} from "../controllers/authController.js"

const authRoutes = express.Router();

authRoutes.get('/login', showLogin);
authRoutes.post('/login', login);

authRoutes.get('/register', showRegister);
authRoutes.post('/register', register)

export {
    authRoutes
}