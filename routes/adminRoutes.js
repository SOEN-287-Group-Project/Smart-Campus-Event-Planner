import express from "express";
import database from "../database/database.js";

const adminRoutes = express.Router();
const adminRoot = 'views/admin-views';

adminRoutes.get('/admin-dashboard', (req, res)=>{
    res.sendFile('admin-dashboard.html', {root: adminRoot});
});

adminRoutes.get('/analytics', (req, res)=>{
    res.sendFile('analytics.html', {root: adminRoot});
});

adminRoutes.get('/create-event', (req, res)=>{
    res.sendFile('create-event.html', {root: adminRoot});
});

adminRoutes.get('/manage-events', (req, res)=>{
    res.sendFile('manage-events.html', {root: adminRoot});
});

adminRoutes.get('/api/events', (req, res) => {
    const events = database.getAllEvent();
    res.json(events);
});

export default adminRoutes;