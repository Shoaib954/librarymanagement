const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.loginPage);
router.get('/register', authController.registerPage);
router.get('/admin-register', authController.adminRegisterPage);
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/admin-register', authController.adminRegister);
router.post('/logout', authController.logout);

module.exports = router;