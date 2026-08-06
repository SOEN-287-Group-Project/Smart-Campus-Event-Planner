import express from "express";
import publicRoutes from "./routes/publicRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// initialize the server
const app = express();

// set the static root
app.use(express.static('assets'));

// middleware for parsing incoming request URLs
app.use(express.urlencoded({ extended: true }));

// redirect the landing page
app.get('/', (req, res)=>{
    res.redirect('/public/index');
});

// mount the routers
app.use('/public', publicRoutes);
app.use('/auth', authRoutes);
app.use('/student', studentRoutes);
app.use('/admin', adminRoutes);

// start server
app.listen(3000, 'localhost');