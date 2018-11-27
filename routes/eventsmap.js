const express = require('express');
const Geohash = require('geo-hash');
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
    pointerLocation,
  } = req.body.formData;
  const geoPoint = Geohash.encode(pointerLocation.lat, pointerLocation.lng, 9);
  const urlTicketMaster = `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${keyValue}&geoPoint=${geoPoint}&radius=${radius}&unit=km&countryCode=ES&apikey=${process.env.TICKETMASTER_KEY}`;
  axios.get(urlTicketMaster)
    .then((ticketresponse) => {
      // console.log(ticketresponse.data._embedded.events);
      const geojson = convertToGeoJSON(ticketresponse.data._embedded.events);

      res.json({
        geojson,
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

// CAMBIO DE PRUEBAS PARA

module.exports = router;


function convertToGeoJSON(arr) {
  let count = 1;

  const geojson = {
    type: 'FeatureCollection',
    features: [],
  };

  for (i = 0; i < arr.length; i++) {
    if (arr[i]._embedded.venues[0].hasOwnProperty('location')) {
      geojson.features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [arr[i]._embedded.venues[0].location.longitude, arr[i]._embedded.venues[0].location.latitude],
        },
        properties: {
          id: count,
          eventName: arr[i].name,
          eventUrl: arr[i].url,
          eventImage: arr[i].images[1].url,
          // eventPriceMax: arr[i].priceRanges[0].max, MIRAR SI ESTAN VACÍOS EN ALGUNO
          // eventPriceMin: arr[i].priceRanges[0].min,
          eventPlaceName: arr[i]._embedded.venues[0].name,
        },
      });
    }

    count++;
  }


  return geojson;
}
