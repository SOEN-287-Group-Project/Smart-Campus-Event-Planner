import express from "express";
import { login, register } from "./controllers/authController.js"
// import { authRoutes } from "./routes/authRoutes.js";

const app = express();

app.use(express.static('assets'));

app.use(express.urlencoded({ extended: true }));

// ********************

app.get('/', (req, res)=>{
    res.sendFile('index.html', {root: 'views/public-views'})
});

app.get('/admin-dashboard', (req, res)=>{
    res.sendFile('admin-dashboard.html', {root: 'views/admin-views'})
});

app.get('/analytics', (req, res)=>{
    res.sendFile('analytics.html', {root: 'views/admin-views'})
});

app.get('/create-event', (req, res)=>{
    res.sendFile('create-event.html', {root: 'views/admin-views'})
});

app.get('/manage-events', (req, res)=>{
    res.sendFile('register.html', {root: 'views/admin-public'})
});

app.get('/about', (req, res)=>{
    res.sendFile('about.html', {root: 'views/public-views'})
});

app.get('/contact', (req, res)=>{
    res.sendFile('contact.html', {root: 'views/public-views'})
});

app.get('/index', (req, res)=>{
    res.sendFile('index.html', {root: 'views/public-views'})
});

app.get('/login', (req, res)=>{
    res.sendFile('login.html', {root: 'views/public-views'})
});

app.get('/register', (req, res)=>{
    res.sendFile('register.html', {root: 'views/public-views'})
});

app.get('/event-details', (req, res)=>{
    res.sendFile('event-details.html', {root: 'views/student-views'})
});

app.get('/events', (req, res)=>{
    res.sendFile('events.html', {root: 'views/student-views'})
});

app.get('/my-registrations', (req, res)=>{
    res.sendFile('my-registrations.html', {root: 'views/student-views'})
});

app.get('/profile', (req, res)=>{
    res.sendFile('profile.html', {root: 'views/student-views'})
});

app.get('/student-dashboard', (req, res)=>{
    res.sendFile('student-dashboard.html', {root: 'views/student-views'})
});

// ********************

app.post('/register', register)

// ********************

// app.use('/auth', authRoutes);

// start server
app.listen(3000, 'localhost');