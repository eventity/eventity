const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGRpZXpyIiwiYSI6ImNqb3ZuMGZ3cjFqa2YzcWxrYjBtNjJzaG4ifQ.cCFZkl39Hov3D-Ujeq74Cg';
document.addEventListener('DOMContentLoaded', () => {
  console.log('IronGenerator JS imported successfully!');

  mapboxgl.accessToken = MAPBOX_TOKEN;
  const map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/light-v9', // stylesheet location
    center: [-3.703790, 40.416775], // starting position [lng, lat]
    zoom: 11, // starting zoom
    // bearing: 29,
  });

  document.getElementById('btn-search').onclick = function () {
    const keyValue = document.querySelector('#key-value').value;
    const startDate = document.querySelector('#start-date').value;
    const endDate = document.querySelector('#end-date').value;
    const radius = document.querySelector('#radius').value;
    const formData = {
      keyValue,
      startDate,
      endDate,
      radius,

    };
    axios.post('/events/eventsmap', {
      formData,
    }).then((geojsonData) => {
      const geojson = geojsonData.data.geojson;
      console.log(geojson);
      // add markers to map
      geojson.features.forEach((marker) => {
        // create a HTML element for each feature
        const el = document.createElement('div');
        el.className = 'marker';

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
          .setLngLat(marker.geometry.coordinates)
          .setPopup(new mapboxgl.Popup({
            offset: 25,
          }) // add popups
            .setHTML(`<h3>${marker.properties.eventName}</h3><p>${marker.properties.eventPlaceName}</p>`))
          .addTo(map);
      });
    })
      .catch((error) => {
        console.log(error);
      });
  };


  // const geojson = {
  //   type: 'FeatureCollection',
  //   features: [{
  //     type: 'Feature',
  //     geometry: {
  //       type: 'Point',
  //       coordinates: [-3.6758, 40.42394],
  //     },
  //     properties: {
  //       title: 'Elton Jhon',
  //       description: 'Washington, D.C.',
  //     },
  //   },
  //   {
  //     type: 'Feature',
  //     geometry: {
  //       type: 'Point',
  //       coordinates: [-122.414, 37.776],
  //     },
  //     properties: {
  //       title: 'Mapbox',
  //       description: 'San Francisco, California',
  //     },
  //   },
  //   ],
  // };


  const picker = document.querySelectorAll('.datepicker');
  const instances = M.Datepicker.init(picker);
}, false);
