const { Router } = require('express');
const authController = require('../controllers/authController');
const { protectWhenLogin, isLogin } = require('../controllers/loginChecks');

const router = Router();

router.get('/signup', protectWhenLogin, authController.signup_get);
router.post('/signup', protectWhenLogin, authController.signup_post);
router.get('/login', protectWhenLogin, authController.login_get);
router.post('/login', protectWhenLogin, authController.login_post);
router.get('/logout', isLogin, authController.logout_get);

module.exports = router;
