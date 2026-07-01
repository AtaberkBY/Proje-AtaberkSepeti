const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');


//endpoints
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshAccessToken)

module.exports = router;