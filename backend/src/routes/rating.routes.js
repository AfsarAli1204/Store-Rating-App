const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const ratingController = require('../controllers/rating.controller');

// This route handles both submitting a new rating and updating an old one.
router.post('/', verifyToken, ratingController.submitOrUpdateRating);

module.exports = router;