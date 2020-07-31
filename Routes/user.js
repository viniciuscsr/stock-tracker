const express = require('express');
const router = express.Router();

const { check } = require('express-validator');
const userController = require('../controllers/userController');

//SIGNUP
router.get('/signup', userController.getSignup);

router.post(
  '/signup',
  check('password', 'must be at least 6 characters long').isLength({ min: 6 }),
  check('name', 'Please enter your name').not().isEmpty(),
  check('email', 'Your email is not valid').isEmail(),
  userController.postSignup
);

router.get('/login', userController.getLogin);

router.post('/login', userController.postLogin);

router.get('/logout', userController.logout);

module.exports = router;
