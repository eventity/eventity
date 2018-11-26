const express = require('express');
require('dotenv').config();

const router = express.Router();
const axios = require('axios');
const ensureLogin = require('connect-ensure-login');

router.get('/eventsmap', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render('events/eventsmap');
});
// https://app.ticketmaster.com/discovery/v2/events.json?keyword=rock&geoPoint=ezjmu4tgh&radius=8&unit=km&countryCode=ES&apikey=zM7ECwQhJETmF6sI9PUadItdWJPpCJPX
router.post('/eventsmap', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  // Get data from the form in the front
  console.log(req.body.formData);
  const {
    keyValue,
    startDate,
    endDate,
    radius,
  } = req.body.formData;
  const urlTicketMaster = `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${keyValue}&geoPoint=ezjmu4tgh&radius=${radius}&unit=km&countryCode=ES&apikey=${process.env.TICKETMASTER_KEY}`;
  axios.get(urlTicketMaster)
    .then((ticketresponse) => {
      console.log(ticketresponse.data._embedded.events);
      // res.json({
      //   ticketresponse.data._embedded.events,
      // });
    })
    .catch((error) => {
      console.log(error);
    });
});

// CAMBIO DE PRUEBAS PARA

module.exports = router;
