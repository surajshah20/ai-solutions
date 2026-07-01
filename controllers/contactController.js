const db = require('../config/db');

exports.getContactForm = (req, res) => {
    res.render('contact', {
        title: 'Contact Us | AI-Solutions'
    });
};

exports.submitContactForm = async (req, res) => {
    const { name, email, phone, company_name, country, job_title, job_details } = req.body;

    // Basic validation
    if (!name || !email || !phone || !company_name || !country || !job_title || !job_details) {
        req.flash('error', 'Please fill in all required fields.');
        return res.redirect('/contact');
    }

    try {
        await db.query(
            `INSERT INTO inquiries (name, email, phone, company_name, country, job_title, job_details)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [name, email, phone, company_name, country, job_title, job_details]
        );
        req.flash('success', 'Your inquiry has been submitted successfully! We will be in touch shortly.');
        res.redirect('/contact');
    } catch (err) {
        console.error('Contact form error:', err);
        req.flash('error', 'An error occurred while submitting your inquiry. Please try again.');
        res.redirect('/contact');
    }
};
