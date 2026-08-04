import express from "express";
import { login, register } from "../controllers/authController.js"

/*
const authRoutes = express.Router();

authRoutes.get('/login', (req, res)=>{
    res.sendFile('login.html', {root: 'views'})
});
authRoutes.post('/login', login);

authRoutes.get('/register', (req, res)=>{
    res.sendFile('register.html', {root: 'views'})
});

authRoutes.post('/register', register)

export {
    authRoutes
}
*/