import express from "express";

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
app.use('/public', authRoutes);
app.use('/auth', authRoutes);
app.use('/student', authRoutes);
app.use('/admin', authRoutes);

// start server
app.listen(3000, 'localhost');