const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { ensureAuthenticated } = require('../middleware/auth');

router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin);
router.get('/logout', adminController.logout);

// Dashboard & inquiries
router.get('/dashboard', ensureAuthenticated, adminController.getDashboard);
router.get('/inquiry/:id', ensureAuthenticated, adminController.getInquiry);
router.get('/inquiry/:id/edit', ensureAuthenticated, adminController.getEditInquiry);
router.post('/inquiry/:id/edit', ensureAuthenticated, adminController.postEditInquiry);
router.post('/inquiry/:id/delete', ensureAuthenticated, adminController.deleteInquiry);

// Feedback
router.get('/feedback-list', ensureAuthenticated, adminController.getFeedbackList);
router.post('/feedback/:id/delete', ensureAuthenticated, adminController.deleteFeedback);

// Articles
router.get('/articles', ensureAuthenticated, adminController.getAdminArticles);
router.get('/articles/add', ensureAuthenticated, adminController.getAddArticle);
router.post('/articles/add', ensureAuthenticated, adminController.postAddArticle);
router.get('/articles/:id/edit', ensureAuthenticated, adminController.getEditArticle);
router.post('/articles/:id/edit', ensureAuthenticated, adminController.postEditArticle);
router.post('/articles/:id/delete', ensureAuthenticated, adminController.deleteArticle);

// Gallery
router.get('/gallery', ensureAuthenticated, adminController.getAdminGallery);
router.post('/gallery/add', ensureAuthenticated, adminController.postAddGallery);
router.post('/gallery/:id/delete', ensureAuthenticated, adminController.deleteGallery);

// Events
router.get('/events', ensureAuthenticated, adminController.getAdminEvents);
router.get('/events/add', ensureAuthenticated, adminController.getAddEvent);
router.post('/events/add', ensureAuthenticated, adminController.postAddEvent);
router.get('/events/:id/edit', ensureAuthenticated, adminController.getEditEvent);
router.post('/events/:id/edit', ensureAuthenticated, adminController.postEditEvent);
router.post('/events/:id/delete', ensureAuthenticated, adminController.deleteEvent);

module.exports = router;