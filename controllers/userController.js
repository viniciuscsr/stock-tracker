const userController = {};

const pool = require('../db');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { validationResult } = require('express-validator');

userController.getSignup = (req, res) => {
  res.render('users/signup');
};

userController.postSignup = async (req, res) => {
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
};

userController.getLogin = (req, res) => {
  res.render('users/login');
};

userController.postLogin = passport.authenticate('local', {
  successRedirect: '/portifolio',
  failureRedirect: 'login',
});

userController.logout = (req, res) => {
  req.logOut();
  res.redirect('/');
};

module.exports = userController;
