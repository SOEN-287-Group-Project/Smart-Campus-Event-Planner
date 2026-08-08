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

adminRoutes.get('/api/attendance', (req, res) => {
    const registrations = database.getAllRegistrations();
    res.json(registrations);
});

adminRoutes.put("/api/events/:id", (req, res) => {
    const eventId = req.params.id;

    const {
        title,
        event_date,
        start_time,
        end_time,
        category_id,
        capacity,
        description
    } = req.body;

    try {
        const updatedEvent = database.updateEvent(
            eventId,
            category_id,
            title,
            description,
            event_date,
            start_time,
            end_time,
            capacity
        );

        if (!updatedEvent) {
            return res.status(404).json({
                error: "Event not found"
            });
        }

        res.json(updatedEvent);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to update event"
        });
    }
});




export default adminRoutes;