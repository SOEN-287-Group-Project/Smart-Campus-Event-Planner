
//Admin authentication middleware
/*function requireAdmin(req, res, next) { 
    // User is not logged in
    if (!req.session.userId) {
        return res.status(401).json({
            error: "You must be logged in."
        });
    }

    // User is logged in but isn't an admin
    if (req.session.role !== "admin") {
        return res.status(403).json({
            error: "Admin access required."
        });
    }

    next();
}

export default requireAdmin;*/