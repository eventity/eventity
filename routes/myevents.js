const express = require('express');

const router = express.Router();
const ensureLogin = require('connect-ensure-login');
const Myevents = require('../models/Myevents');


router.get('/myevents', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const userId = req.user._id;
  console.log('------------', userId);
  Myevents.find({ idUser: userId })
    .then((myEvents) => {
      console.log('------------', myEvents);
      res.render('events/myevents', { myEvents });
    })
    .catch((error) => {
      console.log(`Error finding Events ${error}`);
    });
});


module.exports = router;
