const db = require('../config/db');
const bcrypt = require('bcrypt');

// GET /admin/login
exports.getLogin = (req, res) => {
    if (req.session.admin) return res.redirect('/admin/dashboard');
    res.render('admin/login', { title: 'Admin Login | AI-Solutions' });
};

// POST /admin/login
exports.postLogin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        req.flash('error', 'Please enter both username and password.');
        return res.redirect('/admin/login');
    }

    try {
        const result = await db.query('SELECT * FROM admins WHERE username = $1', [username]);

        if (result.rows.length === 0) {
            req.flash('error', 'Invalid username or password.');
            return res.redirect('/admin/login');
        }

        const admin = result.rows[0];
        const isMatch = await bcrypt.compare(password, admin.password_hash);

        if (!isMatch) {
            req.flash('error', 'Invalid username or password.');
            return res.redirect('/admin/login');
        }

        req.session.admin = { id: admin.id, username: admin.username };
        req.flash('success', `Welcome back, ${admin.username}!`);
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error('Login error:', err);
        req.flash('error', 'Server error. Please try again.');
        res.redirect('/admin/login');
    }
};

// GET /admin/logout
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/admin/login');
    });
};

// GET /admin/dashboard
exports.getDashboard = async (req, res) => {
    try {
        const inquiries = await db.query('SELECT * FROM inquiries ORDER BY created_at DESC');
        const totalResult = await db.query('SELECT COUNT(*) FROM inquiries');
        const newResult = await db.query("SELECT COUNT(*) FROM inquiries WHERE status = 'new'");
        const readResult = await db.query("SELECT COUNT(*) FROM inquiries WHERE status = 'read'");
        const feedbackResult = await db.query('SELECT COUNT(*) FROM feedback');

        res.render('admin/dashboard', {
            title: 'Admin Dashboard | AI-Solutions',
            inquiries: inquiries.rows,
            total: parseInt(totalResult.rows[0].count),
            newCount: parseInt(newResult.rows[0].count),
            readCount: parseInt(readResult.rows[0].count),
            feedbackCount: parseInt(feedbackResult.rows[0].count)
        });
    } catch (err) {
        console.error('Dashboard error:', err);
        req.flash('error', 'Could not load dashboard data.');
        res.render('admin/dashboard', {
            title: 'Admin Dashboard | AI-Solutions',
            inquiries: [],
            total: 0,
            newCount: 0,
            readCount: 0,
            feedbackCount: 0
        });
    }
};

// GET /admin/inquiry/:id
exports.getInquiry = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM inquiries WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            req.flash('error', 'Inquiry not found.');
            return res.redirect('/admin/dashboard');
        }
        // Mark as read when viewed
        await db.query("UPDATE inquiries SET status = 'read' WHERE id = $1 AND status = 'new'", [req.params.id]);
        res.render('admin/inquiry', {
            title: 'Inquiry Details | AI-Solutions',
            inquiry: result.rows[0]
        });
    } catch (err) {
        console.error('Get inquiry error:', err);
        req.flash('error', 'Could not load inquiry.');
        res.redirect('/admin/dashboard');
    }
};

// GET /admin/inquiry/:id/edit
exports.getEditInquiry = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM inquiries WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            req.flash('error', 'Inquiry not found.');
            return res.redirect('/admin/dashboard');
        }
        res.render('admin/edit', {
            title: 'Edit Inquiry | AI-Solutions',
            inquiry: result.rows[0]
        });
    } catch (err) {
        console.error('Get edit inquiry error:', err);
        req.flash('error', 'Could not load inquiry for editing.');
        res.redirect('/admin/dashboard');
    }
};

// POST /admin/inquiry/:id/edit
exports.postEditInquiry = async (req, res) => {
    const { name, email, phone, company_name, country, job_title, job_details, status } = req.body;
    try {
        await db.query(
            `UPDATE inquiries
             SET name=$1, email=$2, phone=$3, company_name=$4, country=$5,
                 job_title=$6, job_details=$7, status=$8
             WHERE id=$9`,
            [name, email, phone, company_name, country, job_title, job_details, status, req.params.id]
        );
        req.flash('success', 'Inquiry updated successfully.');
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error('Edit inquiry error:', err);
        req.flash('error', 'Failed to update inquiry.');
        res.redirect(`/admin/inquiry/${req.params.id}/edit`);
    }
};

// POST /admin/inquiry/:id/delete
exports.deleteInquiry = async (req, res) => {
    try {
        await db.query('DELETE FROM inquiries WHERE id = $1', [req.params.id]);
        req.flash('success', 'Inquiry deleted successfully.');
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error('Delete inquiry error:', err);
        req.flash('error', 'Failed to delete inquiry.');
        res.redirect('/admin/dashboard');
    }
};

// ========== FEEDBACK ==========
exports.getFeedbackList = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM feedback ORDER BY created_at DESC');
        res.render('admin/feedback-list', {
            title: 'Feedback | AI-Solutions Admin',
            feedbacks: result.rows
        });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Could not load feedback.');
        res.redirect('/admin/dashboard');
    }
};

exports.deleteFeedback = async (req, res) => {
    try {
        await db.query('DELETE FROM feedback WHERE id = $1', [req.params.id]);
        req.flash('success', 'Feedback deleted.');
        res.redirect('/admin/feedback-list');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to delete feedback.');
        res.redirect('/admin/feedback-list');
    }
};

// ========== ARTICLES ==========
exports.getAdminArticles = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM articles ORDER BY created_at DESC');
        res.render('admin/articles', {
            title: 'Articles | AI-Solutions Admin',
            articles: result.rows
        });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Could not load articles.');
        res.redirect('/admin/dashboard');
    }
};

exports.getAddArticle = (req, res) => {
    res.render('admin/article-form', {
        title: 'Add Article | AI-Solutions Admin',
        article: null,
        action: '/admin/articles/add'
    });
};

exports.postAddArticle = async (req, res) => {
    const { title, category, author, content, is_featured } = req.body;
    if (!title || !category || !author || !content) {
        req.flash('error', 'Please fill in all fields.');
        return res.redirect('/admin/articles/add');
    }
    try {
        await db.query(
            'INSERT INTO articles (title, category, author, content, is_featured) VALUES ($1, $2, $3, $4, $5)',
            [title, category, author, content, is_featured === 'on']
        );
        req.flash('success', 'Article published successfully.');
        res.redirect('/admin/articles');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to add article.');
        res.redirect('/admin/articles/add');
    }
};

exports.getEditArticle = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM articles WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            req.flash('error', 'Article not found.');
            return res.redirect('/admin/articles');
        }
        res.render('admin/article-form', {
            title: 'Edit Article | AI-Solutions Admin',
            article: result.rows[0],
            action: `/admin/articles/${req.params.id}/edit`
        });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Could not load article.');
        res.redirect('/admin/articles');
    }
};

exports.postEditArticle = async (req, res) => {
    const { title, category, author, content, is_featured } = req.body;
    try {
        await db.query(
            'UPDATE articles SET title=$1, category=$2, author=$3, content=$4, is_featured=$5 WHERE id=$6',
            [title, category, author, content, is_featured === 'on', req.params.id]
        );
        req.flash('success', 'Article updated successfully.');
        res.redirect('/admin/articles');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to update article.');
        res.redirect(`/admin/articles/${req.params.id}/edit`);
    }
};

exports.deleteArticle = async (req, res) => {
    try {
        await db.query('DELETE FROM articles WHERE id = $1', [req.params.id]);
        req.flash('success', 'Article deleted.');
        res.redirect('/admin/articles');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to delete article.');
        res.redirect('/admin/articles');
    }
};

// ========== GALLERY ==========
exports.getAdminGallery = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM gallery ORDER BY created_at DESC');
        res.render('admin/gallery', {
            title: 'Gallery | AI-Solutions Admin',
            images: result.rows
        });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Could not load gallery.');
        res.redirect('/admin/dashboard');
    }
};

exports.postAddGallery = async (req, res) => {
    const { image_url, caption } = req.body;
    if (!image_url || !caption) {
        req.flash('error', 'Please provide both image URL and caption.');
        return res.redirect('/admin/gallery');
    }
    try {
        await db.query('INSERT INTO gallery (image_url, caption) VALUES ($1, $2)', [image_url, caption]);
        req.flash('success', 'Image added to gallery.');
        res.redirect('/admin/gallery');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to add image.');
        res.redirect('/admin/gallery');
    }
};

exports.deleteGallery = async (req, res) => {
    try {
        await db.query('DELETE FROM gallery WHERE id = $1', [req.params.id]);
        req.flash('success', 'Image deleted from gallery.');
        res.redirect('/admin/gallery');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to delete image.');
        res.redirect('/admin/gallery');
    }
};

// ========== EVENTS ==========
exports.getAdminEvents = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM events ORDER BY event_date ASC');
        res.render('admin/events', {
            title: 'Events | AI-Solutions Admin',
            events: result.rows
        });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Could not load events.');
        res.redirect('/admin/dashboard');
    }
};

exports.getAddEvent = (req, res) => {
    res.render('admin/event-form', {
        title: 'Add Event | AI-Solutions Admin',
        event: null,
        action: '/admin/events/add'
    });
};

exports.postAddEvent = async (req, res) => {
    const { title, description, event_date, location, event_type, is_featured } = req.body;
    if (!title || !description || !event_date || !location) {
        req.flash('error', 'Please fill in all fields.');
        return res.redirect('/admin/events/add');
    }
    try {
        await db.query(
            'INSERT INTO events (title, description, event_date, location, event_type, is_featured) VALUES ($1, $2, $3, $4, $5, $6)',
            [title, description, event_date, location, event_type || 'in-person', is_featured === 'on']
        );
        req.flash('success', 'Event added successfully.');
        res.redirect('/admin/events');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to add event.');
        res.redirect('/admin/events/add');
    }
};

exports.getEditEvent = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            req.flash('error', 'Event not found.');
            return res.redirect('/admin/events');
        }
        res.render('admin/event-form', {
            title: 'Edit Event | AI-Solutions Admin',
            event: result.rows[0],
            action: `/admin/events/${req.params.id}/edit`
        });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Could not load event.');
        res.redirect('/admin/events');
    }
};

exports.postEditEvent = async (req, res) => {
    const { title, description, event_date, location, event_type, is_featured } = req.body;
    try {
        await db.query(
            'UPDATE events SET title=$1, description=$2, event_date=$3, location=$4, event_type=$5, is_featured=$6 WHERE id=$7',
            [title, description, event_date, location, event_type, is_featured === 'on', req.params.id]
        );
        req.flash('success', 'Event updated successfully.');
        res.redirect('/admin/events');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to update event.');
        res.redirect(`/admin/events/${req.params.id}/edit`);
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        await db.query('DELETE FROM events WHERE id = $1', [req.params.id]);
        req.flash('success', 'Event deleted.');
        res.redirect('/admin/events');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to delete event.');
        res.redirect('/admin/events');
    }
};
