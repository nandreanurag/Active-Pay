const express = require('express');
const router = express.Router();
// const signupSchema = require('../schemas/signupSchema');
// const loginSchema = require('../schemas/loginSchema');
const authController = require('../controller/auth.js');
const verifyToken = require('../middleware/verifyToken.js');
// const profileSchema = require('../schemas/profileSchema');

// routes
router.post('/signup', authController.signup);
router.post('/login',  authController.login);
router.get('/profile',verifyToken, authController.getProfile); //http://localhost:8082/api/user/profile
router.patch('/profile',verifyToken, authController.editProfile); 

module.exports = router;