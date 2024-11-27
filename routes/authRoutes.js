const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../controllers/authController');

router.get('/dashboard', isAuthenticated, (req, res) => {
    const userType = req.session.user.type;
    const userName = req.session.user.name;

    if (userType === 'user') {
        res.render('userDashboard', { name: userName });
    } else if (userType === 'supplier') {
        res.render('supplierDashboard', { name: userName });
    } else {
        res.redirect('/login'); // Fallback for invalid session data
    }
});

router.get('/signup', (req, res) => res.render('signup'));
router.post('/signup', authController.signup);

router.get('/login', authController.renderLogin);
router.post('/login', authController.login);

router.get('/logout', authController.logout);

module.exports = router;
