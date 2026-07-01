require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

const publicRoutes = require('./routes/publicRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// Flash messages
app.use(flash());

// Global locals for all views
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success');
    res.locals.error_msg = req.flash('error');
    res.locals.admin = req.session.admin || null;
    next();
});

// Routes
app.use('/', publicRoutes);
app.use('/contact', contactRoutes);
app.use('/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', { title: '404 - Page Not Found' });
});

app.listen(PORT, () => {
    console.log(`✅ AI-Solutions running at http://localhost:${PORT}`);
});
