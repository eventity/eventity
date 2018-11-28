require('dotenv').config();
const express = require('express');
const Geohash = require('geo-hash');


const router = express.Router();
const axios = require('axios');
const ensureLogin = require('connect-ensure-login');
const Myevents = require('../models/Myevents');

router.get('/eventsmap', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  res.render('events/eventsmap', { TOKEN_ENV: process.env.MAPBOX_TOKEN });
});
// https://app.ticketmaster.com/discovery/v2/events.json?keyword=rock&geoPoint=ezjmu4tgh&radius=8&unit=km&countryCode=ES&apikey=zM7ECwQhJETmF6sI9PUadItdWJPpCJPX
router.post('/eventsmap', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  // Get data from the form in the front to search data in ticjer master
  console.log(req.body.formData);
  const {
    keyValue,
    startDate,
    endDate,
    radius,
    pointerLocation,
  } = req.body.formData;
  const geoPoint = Geohash.encode(pointerLocation.lat, pointerLocation.lng, 9);
  let urlTicketMaster = '';
  if (startDate === endDate) {
    urlTicketMaster = `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${keyValue}&geoPoint=${geoPoint}&radius=${radius}&unit=km&countryCode=ES&apikey=${process.env.TICKETMASTER_KEY}&startDateTime=${startDate}`;
  } else {
    urlTicketMaster = `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${keyValue}&geoPoint=${geoPoint}&radius=${radius}&unit=km&countryCode=ES&apikey=${process.env.TICKETMASTER_KEY}&startDateTime=${startDate}&endDateTime=${endDate}`;
  }
  // GET data from api Ticketmaster
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


function convertToGeoJSON(arr) {
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
          eventId: arr[i].id,
          eventName: arr[i].name,
          eventUrl: arr[i].url,
          eventImage: arr[i].images[1].url,
          // eventPrice: arr[i].priceRanges[0].min,
          eventPlaceName: arr[i]._embedded.venues[0].name,
          eventDate: arr[i].dates.start.localDate,
          eventTime: arr[i].dates.start.localTime,
        },
      });
    }
  }


  return geojson;
}


router.post('/myevents', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  console.log(req.body);
  const newEvent = new Myevents({
    ticketMasterId: req.body.eventId,
    name: req.body.eventName,
    image: req.body.eventImg,
    url: req.body.eventUrl,
    date:req.body.eventDate,
    time: req.body.eventTime,
    location: {
      longitude: req.body.eventLng,
      latitude: req.body.eventLat,
    },
    placeName: req.body.eventPlaceName,
    idUser: req.user._id,
  });

  newEvent.save()
    .then((savedEvent) => {
      console.log(savedEvent);
      res.json({
        body: req.body.data,
      });
    })
    .catch((error) => {
      console.log(error);
    });
});


module.exports = router;
