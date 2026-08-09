import express from "express";
import studentController from "../controllers/studentController.js";
import database from "../database/database.js";

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

studentRoutes.get(
    '/api/profile',
    studentController.getProfile
);

studentRoutes.put(
    '/api/profile',
    studentController.updateProfile
);
studentRoutes.put(

    '/api/profile/password',

    studentController.updatePassword

);

studentRoutes.get(
    '/api/dashboard',
    studentController.getStudentDashboard
);

studentRoutes.get('/student-dashboard', (req, res) => {
    if (!req.session.userId) {
      return res.redirect('/public/index');
    }
    res.sendFile('student-dashboard.html', { root: studentRoot });
  });

studentRoutes.get('/api/events', (req, res) => {
    const events = database.getAllEvent();
    res.json(events);
});

studentRoutes.get('/api/my-registrations',
studentController.getMyRegistrations
);

export default studentRoutes;