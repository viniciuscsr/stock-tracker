const LocalStrategy = require('passport-local').Strategy;
const pool = require('./db');
const bcrypt = require('bcrypt');

function initialize(passport) {
  const authenticateUser = (email, password, done) => {
    pool.query(
      `SELECT * FROM user1 WHERE email = $1`,
      [email],
      (err, response) => {
        if (err) {
          throw err;
        }
        // console.log(response.rows);

        if (response.rows.length > 0) {
          const user = response.rows[0];

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              throw err;
            }
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Incorrect password' });
            }
          });
        } else {
          return done(null, false, { message: ' Email not Registered' });
        }
      }
    );
  };
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      authenticateUser
    )
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    pool.query(`SELECT * FROM user1 WHERE id=$1`, [id], (err, response) => {
      if (err) {
        throw err;
      }
      return done(null, response.rows[0]);
    });
  });
}

module.exports = initialize;
