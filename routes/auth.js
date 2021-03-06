const express = require('express');
const passport = require('passport');

const router = express.Router();
const bcrypt = require('bcrypt');
const ensureLogin = require('connect-ensure-login');

const User = require('../models/User');

// Bcrypt to encrypt passwords
const bcryptSalt = 10;


router.get('/login', (req, res, next) => {
  res.render('auth/login', {
    message: req.flash('error'),
  });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/events/eventsmap',
  failureRedirect: '/auth/login',
  failureFlash: true,
  passReqToCallback: true,
}));

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  if (username === '' || password === '') {
    res.render('auth/signup', {
      message: 'Indicate username and password',
    });
    return;
  }

  User.findOne({
    username,
  }, 'username', (err, user) => {
    if (user !== null) {
      res.render('auth/signup', {
        message: 'The username already exists',
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      email,
    });

    newUser.save()
      .then(() => {
        res.redirect('/');
      })
      .catch((err) => {
        res.render('auth/signup', {
          message: 'Something went wrong',
        });
      });
  });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
