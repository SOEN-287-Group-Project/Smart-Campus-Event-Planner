import express from "express";
import database from "../database/database.js";
import requireAdmin from "../controllers/adminController.js";

const adminRoutes = express.Router();
const adminRoot = "views/admin-views";

adminRoutes.use(requireAdmin); //Admin routes are protected by the requireAdmin middleware

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



// ********** API Functions for updating  **********
adminRoutes.put("/api/events/:id", (req, res) => {
    const eventId = req.params.id;

    const {
        title,
        event_date,
        start_time,
        end_time,
        category_id,
        capacity,
        location,
        description,
        status
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
            capacity,
            location,
            status
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

adminRoutes.delete("/api/events/:eventId", (req, res) => {
    try {
        const eventId = req.params.eventId;

        const deletedEvent = database.deleteEvent(eventId);

        if (!deletedEvent) {
            return res.status(404).json({
                error: "Event not found"
            });
        }

        res.json({
            message: "Event deleted successfully",
            event_id: eventId
        });

    } catch (error) {
        console.error("DELETE EVENT ERROR:", error);

        res.status(500).json({
            error: "Failed to delete event",
            details: error.message
        });
    }
});

// Change attendance by event_id
adminRoutes.put("/api/attendance/:eventId/:userId", (req, res) => {
    const eventId = req.params.eventId;
    const userId = req.params.userId;

    const { attended } = req.body;

    try{
        const updatedAttendance = database.updateAttendance( 
            eventId,
            userId,
            attended
        );

        if (!updatedAttendance) {
            return res.status(404).json({
                error: "Attendance record not found"
            });
        }
        
        res.json(updatedAttendance);

        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Failed to update attendance"
            });    
        }    
    });    



adminRoutes.post("/new_event", (req, res) => {
    try {
        const {
            organizer_id,
            category_id,
            title,
            description,
            event_date,
            start_time,
            end_time,
            location,
            capacity,
            status
        } = req.body;

        // Basic validation
        if (
            !organizer_id ||
            !category_id ||
            !title ||
            !description ||
            !event_date ||
            !start_time ||
            !end_time ||
            !capacity ||
            !location ||
            !status
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing required event information."
            });
        }

        const result = database.addEvents(
            organizer_id,
            category_id,
            title,
            description,
            event_date,
            start_time,
            end_time,
            location,
            capacity,
            status
        );

        res.status(201).json({
            success: true,
            message: "Event created successfully.",
            eventId: result.lastInsertRowid
        });

    } catch (error) {
        console.error("Error creating event:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create event."
        });
    }
});

export default adminRoutes;