import express from "express";

const studentRoutes = express.Router();
const studentRoot = 'views/student-views';

studentRoutes.get('/events-details', (req, res)=>{
    res.sendFile('events-details.html', {root: studentRoot});
});

studentRoutes.get('/events', (req, res)=>{
    res.sendFile('events.html', {root: studentRoot});
});

studentRoutes.get('/my-registrations', (req, res)=>{
    res.sendFile('my-registrations.html', {root: studentRoot});
});

studentRoutes.get('/profile', (req, res)=>{
    res.sendFile('profile.html', {root: studentRoot});
});

studentRoutes.get('/student-dashboard', (req, res)=>{
    res.sendFile('student-dashboard.html', {root: studentRoot});
});

export default studentRoutes;