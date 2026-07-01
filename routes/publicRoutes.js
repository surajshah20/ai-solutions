const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get('/', publicController.getHome);
router.get('/solutions', publicController.getSolutions);
router.get('/events', publicController.getEvents);
router.get('/articles', publicController.getArticles);
router.get('/feedback', publicController.getFeedback);
router.post('/feedback', publicController.submitFeedback);

module.exports = router;