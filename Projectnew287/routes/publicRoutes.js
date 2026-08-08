import express from "express";

const publicRoutes = express.Router();
const publicRoot = 'views/public-views';

publicRoutes.get('/index', (req, res)=>{
    res.sendFile('index.html', {root: publicRoot})
});

publicRoutes.get('/about', (req, res)=>{
    res.sendFile('about.html', {root: publicRoot})
});

publicRoutes.get('/contact', (req, res)=>{
    res.sendFile('contact.html', {root: publicRoot})
});

export default publicRoutes;