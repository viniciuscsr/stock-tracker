const express = require('express');
const router = express.Router();

const pool = require('../db');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { check, validationResult } = require('express-validator');

//SIGNUP
router.get('/signup', (req, res) => {
  res.render('users/signup');
});

router.post(
  '/signup',
  check('password', 'must be at least 6 characters long').isLength({ min: 6 }),
  check('name', 'Please enter your name').not().isEmpty(),
  check('email', 'Your email is not valid').isEmail(),
  async (req, res) => {
    const { name, username, email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      hashedPassword = await bcrypt.hash(password, 10);

      pool.query(
        'SELECT * FROM user1 WHERE email = $1',
        [email],
        (err, response) => {
          if (err) {
            throw err;
          }
          if (response.rows.length > 0) {
            errors.push({ message: 'Email already registered' });
            res.json(errors);
          } else {
            pool.query(
              `INSERT INTO user1 (name, username, email, password) VALUES ($1, $2 , $3, $4) RETURNING id, password`,
              [name, username, email, hashedPassword],
              (err, response) => {
                if (err) {
                  throw err;
                }
                res.json({ message: 'Successfully registered' });
              }
            );
          }
        }
      );
    }
  }
);

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/portifolio',
    failureRedirect: 'login',
  }),
  (res, req) => {}
);

router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
});

module.exports = router;
