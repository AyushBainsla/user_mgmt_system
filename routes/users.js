const express = require('express');
const passport = require('passport');
const UsersCtrl = require('../controllers/users');
const router = express.Router();

// Public Routes
router.post('/register', UsersCtrl.register);
router.post('/login', passport.authenticate('local', { session: false }), UsersCtrl.login);

// Protected Routes
router.get('/', passport.authenticate('jwt', { session: false }), UsersCtrl.getAllUsers);
router.put('/:id', passport.authenticate('jwt', { session: false }), UsersCtrl.updateUser);

module.exports = router;
