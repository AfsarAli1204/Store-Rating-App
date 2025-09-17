const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/role.middleware');
const adminController = require('../controllers/admin.controller');
const authController = require('../controllers/auth.controller');

// This middleware will be applied to all routes in this file
const requireAdmin = checkRole('System Administrator');

// This line sets up the endpoint for: POST /api/auth/signup
router.post('/signup', authController.signup);

// This line sets up the endpoint for: POST /api/auth/login
router.post('/login', authController.login);

// Dashboard Routes
router.get('/dashboard', [verifyToken, requireAdmin], adminController.getDashboardStats);

// User Management Routes
router.get('/users', [verifyToken, requireAdmin], adminController.getAllUsers);
router.post('/users', [verifyToken, requireAdmin], adminController.createUser);

// Store Management Routes
router.get('/stores', [verifyToken, requireAdmin], adminController.getStores);
router.post('/stores', [verifyToken, requireAdmin], adminController.createStore);

module.exports = router;

