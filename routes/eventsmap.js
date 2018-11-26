const express = require('express');

const router = express.Router();
const ensureLogin = require('connect-ensure-login');

router.get('/eventsmap', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render('events/eventsmap');
});

module.exports = router;
