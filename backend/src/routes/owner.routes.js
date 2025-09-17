const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/role.middleware');
const ownerController = require('../controllers/owner.controller');

// This middleware ensures only users with the 'Store Owner' role can access these routes
const requireOwner = checkRole('Store Owner');

// GET /api/owner/dashboard - The endpoint for the store owner's dashboard
router.get('/dashboard', [verifyToken, requireOwner], ownerController.getDashboard);

module.exports = router;

