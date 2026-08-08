import express from "express";
import publicRoutes from "./routes/publicRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import session from "express-session";


// set port number
const PORT = process.env.PORT || 3000;

// initialize the server
const app = express();

// set the static root
app.use(express.static('assets'));

// middleware for parsing incoming request URLs
app.use(express.urlencoded({ extended: true }));

// Parses incoming JSON request bodies so req.body can be accessed in API routes
app.use(express.json());

// redirect the landing page
app.get('/', (req, res)=>{
    res.redirect('/public/index');
});

app.use(session({
    secret: "change-me-to-something-random", //signing the cookie so that if changed, all sessions are invalidated
    resave: false, //don't save session if nothing has changed
    saveUninitialized: false, //dont create a session until you actually have data to store
  }));

// mount the routers
app.use('/public', publicRoutes);
app.use('/auth', authRoutes);
app.use('/student', studentRoutes);
app.use('/admin', adminRoutes);

// start server
app.listen(PORT, 'localhost');