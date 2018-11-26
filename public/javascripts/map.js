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

  const geojson = {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-3.6758, 40.42394],
      },
      properties: {
        title: 'Elton Jhon',
        description: 'Washington, D.C.',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-122.414, 37.776],
      },
      properties: {
        title: 'Mapbox',
        description: 'San Francisco, California',
      },
    },
    ],
  };

  // add markers to map
  geojson.features.forEach((marker) => {
    // create a HTML element for each feature
    const el = document.createElement('div');
    el.className = 'marker';

    // make a marker for each feature and add to the map
    new mapboxgl.Marker(el)
      .setLngLat(marker.geometry.coordinates)
      .addTo(map);
  });

  const picker = document.querySelectorAll('.datepicker');
  const instances = M.Datepicker.init(picker);
}, false);
