module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.session && req.session.admin) {
            return next();
        }
        req.flash('error', 'Please log in to access the admin area.');
        res.redirect('/admin/login');
    }
};
