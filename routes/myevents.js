const express = require('express');

const router = express.Router();
const ensureLogin = require('connect-ensure-login');

router.get('/myevents', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render('events/myevents');
});


module.exports = router;
