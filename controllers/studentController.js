import database from "../database/database.js";
import bcrypt from "bcrypt";

function getProfile(req, res) {
    if (!req.session.userId) {
        return res.status(401).json({
            message: "You must log in first."
        });
    }

    try {
        const user = database.getUserById(
            req.session.userId
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        const nameParts = user.full_name
            .trim()
            .split(" ");

        const firstName = nameParts[0] || "";
        const lastName = nameParts
            .slice(1)
            .join(" ");

        return res.json({
            firstName,
            lastName,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Unable to load profile."
        });
    }
}

function updateProfile(req, res) {
    if (!req.session.userId) {
        return res.status(401).json({
            message: "You must log in first."
        });
    }

    const {
        firstName,
        lastName,
        email
    } = req.body;

    if (!firstName || !lastName || !email) {
        return res.status(400).json({
            message: "All fields are required."
        });
    }

    const fullName =
        `${firstName.trim()} ${lastName.trim()}`;

    try {
        const result = database.updateUserProfile(
            req.session.userId,
            fullName,
            email.trim()
        );

        if (result.changes === 0) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        req.session.fullName = fullName;

        return res.json({
            message: "Profile updated successfully."
        });
    } catch (error) {
        console.error(error);

        if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return res.status(409).json({
                message: "That email is already being used."
            });
        }

        return res.status(500).json({
            message: "Unable to update profile."
        });
    }
}
function updatePassword(req, res) {
    if (!req.session.userId) {
        return res.status(401).json({
            message: "You must log in first."
        });
    }

    const {
        currentPassword,
        newPassword,
        confirmPassword
    } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
            message: "All password fields are required."
        });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            message: "The new passwords do not match."
        });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({
            message: "The new password must be at least 8 characters."
        });
    }

    try {
        const userPassword = database.getUserPasswordById(
            req.session.userId
        );

        if (!userPassword) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        const currentPasswordIsCorrect = bcrypt.compareSync(
            currentPassword,
            userPassword.password_hash
        );

        if (!currentPasswordIsCorrect) {
            return res.status(401).json({
                message: "The current password is incorrect."
            });
        }

        const newPasswordHash = bcrypt.hashSync(
            newPassword,
            10
        );

        const result = database.updateUserPassword(
            req.session.userId,
            newPasswordHash
        );

        if (result.changes === 0) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        return res.json({
            message: "Password updated successfully."
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Unable to update password."
        });
    }
}

// --------------STUDENT DASHBOARD FUNCTIONS--------------
function getStudentDashboard(req, res) {
    if (!req.session.userId) 
    {
        return res.status(401).json({
            message: "You must log in first."
        });
    }
    
    try {
        const user = database.getUserById(req.session.userId);
    
        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }
    
        const registrations = database.getRegistrationsForUser(
            req.session.userId
        );
    
        return res.json({
            name: user.full_name,
            registrations: registrations
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Unable to load dashboard."
        });
    }
}
// -------- My-regisrations --------------------------------
function getMyRegistrations(req, res) {
    if (!req.session.userId) {
        return res.status(401).json({
            message: "You must log in first."
        });
    }
    
    try {
        const user = database.getUserById(req.session.userId);
    
        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }
    
        // Calls the join function in database.js that returns formatted event data
        const registrations = database.getRegistrationsForUser(
            req.session.userId
        );
    
        return res.json({
            name: user.full_name,
            registrations: registrations
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Unable to load my registrations."
        });
    }
}

function deleteMyRegistration(req, res) {
    try {
        // 1. Grab registrationId from the URL path parameter
        const registrationId = req.params.registrationId;

        // 3. Call your database function
        const result = database.deleteRegistration(registrationId);

        // 4. Check if a database row was actually modified
        if (!result || result.changes === 0) {
            return res.status(404).json({
                error: "Registration not found"
            });
        }

        // 5. Return success response
        return res.json({
            message: "Registration deleted successfully",
            registration_id: registrationId
        });

    } catch (error) {
        console.error("DELETE REGISTRATION ERROR:", error);

        return res.status(500).json({
            error: "Failed to delete registration",
            details: error.message
        });
    }
}


export default {
    getProfile,
    updateProfile,
    updatePassword,
    getStudentDashboard,
    getMyRegistrations,
    deleteMyRegistration
};