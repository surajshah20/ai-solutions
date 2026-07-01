const db = require('../config/db');

exports.getHome = (req, res) => {
    res.render('index', {
        title: 'AI-Solutions | Innovating the Digital Employee Experience'
    });
};

exports.getSolutions = (req, res) => {
    res.render('solutions', {
        title: 'Our Solutions | AI-Solutions'
    });
};

exports.getArticles = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM articles ORDER BY is_featured DESC, created_at DESC');
        res.render('articles', {
            title: 'Articles | AI-Solutions',
            articles: result.rows
        });
    } catch (err) {
        console.error(err);
        res.render('articles', { title: 'Articles | AI-Solutions', articles: [] });
    }
};

exports.getEvents = async (req, res) => {
    try {
        const eventsResult = await db.query('SELECT * FROM events ORDER BY is_featured DESC, event_date ASC');
        const galleryResult = await db.query('SELECT * FROM gallery ORDER BY created_at ASC');
        res.render('events', {
            title: 'Events & Gallery | AI-Solutions',
            events: eventsResult.rows,
            gallery: galleryResult.rows
        });
    } catch (err) {
        console.error(err);
        res.render('events', { title: 'Events & Gallery | AI-Solutions', events: [], gallery: [] });
    }
};

exports.getFeedback = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM feedback ORDER BY created_at DESC'
        );
        res.render('feedback', {
            title: 'Customer Feedback | AI-Solutions',
            feedbacks: result.rows
        });
    } catch (err) {
        console.error('Feedback fetch error:', err);
        res.render('feedback', {
            title: 'Customer Feedback | AI-Solutions',
            feedbacks: []
        });
    }
};

exports.submitFeedback = async (req, res) => {
    const { name, company, rating, message } = req.body;

    if (!name || !company || !rating || !message) {
        req.flash('error', 'Please fill in all fields.');
        return res.redirect('/feedback');
    }

    try {
        await db.query(
            'INSERT INTO feedback (name, company, rating, message) VALUES ($1, $2, $3, $4)',
            [name, company, parseInt(rating), message]
        );
        req.flash('success', 'Thank you for your feedback!');
        res.redirect('/feedback');
    } catch (err) {
        console.error('Feedback submit error:', err);
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('/feedback');
    }
};