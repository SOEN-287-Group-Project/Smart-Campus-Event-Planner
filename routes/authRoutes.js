import express from "express";
import { login, register } from "../controllers/authController.js"

const authRoutes = express.Router();
const authRoot = 'views/auth-views';

authRoutes.get('/login', (req, res)=>{
    res.sendFile('login.html', {root: authRoot})
});

authRoutes.post('/login', login);

authRoutes.get('/register', (req, res)=>{
    res.sendFile('register.html', {root: authRoot})
});

authRoutes.post('/register', register)

export default authRoutes;