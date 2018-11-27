const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGRpZXpyIiwiYSI6ImNqb3ZuMGZ3cjFqa2YzcWxrYjBtNjJzaG4ifQ.cCFZkl39Hov3D-Ujeq74Cg';
document.addEventListener('DOMContentLoaded', () => {
  let pointerCoords = '';
  const coordinates = document.getElementById('coordinates');
  mapboxgl.accessToken = MAPBOX_TOKEN;
  const map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/light-v9', // stylesheet location
    center: [-3.703790, 40.416775], // starting position [lng, lat]
    zoom: 11, // starting zoom
    // bearing: 29,
  });
  const canvas = map.getCanvasContainer();
  drawDragPoint();


  
  // const addMarker = (title, position, map) => {
  //   return new google.maps.Marker({
  //     position,
  //     map,
  //     title
  //   });
  // }




  document.getElementById('btn-search').onclick = function () {
    const pointerLocation = pointerCoords;
    const keyValue = document.querySelector('#key-value').value;
    const startDate = document.querySelector('#start-date').value;
    const endDate = document.querySelector('#end-date').value;
    const radius = document.querySelector('#radius').value;
    const formData = {
      keyValue,
      startDate,
      endDate,
      radius,
      pointerLocation,
    };
    axios.post('/events/eventsmap', {
      formData,
    }).then((geojsonData) => {
      const geojson = geojsonData.data.geojson;
      // add markers to map

      geojson.features.forEach((marker) => {
        const same = [];
        geojson.features.forEach((subMarker) => {
          const coordMain = marker.geometry.coordinates;
          const coordSub = subMarker.geometry.coordinates;
          const idMain = marker.properties.id;
          const idSub = subMarker.properties.id;

          if (coordMain[0] === coordSub[0] && coordMain[1] === coordSub[1] && idMain !== idSub) {
            same.push(subMarker);
          }
        });

        // console.log('Eventos iguales: ', same);

        let html = `<div class="pop-up"><h3>${marker.properties.eventName}</h3><p>${marker.properties.eventPlaceName}</p></div>`;

        same.forEach((event) => {
          html += `<div class="pop-up"><h3>${event.properties.eventName}</h3><p>${event.properties.eventPlaceName}</p></div>`;
        });

        // console.log(html);

        // create a HTML element for each feature
        const el = document.createElement('div');
        el.className = 'marker';
        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
          .setLngLat(marker.geometry.coordinates)
          .setPopup(new mapboxgl.Popup({
            offset: 25,
          }) // add popups
            .setHTML(html))
          .addTo(map);
      });
    })
      .catch((error) => {
        console.log(error);
      });
  };

  function drawDragPoint() {
    const geojson = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-3.703790, 40.416775],
        },
      }],
    };

    function onMove(e) {
      const coords = e.lngLat;

      // Set a UI indicator for dragging.
      canvas.style.cursor = 'grabbing';

      // Update the Point feature in `geojson` coordinates
      // and call setData to the source layer `point` on it.
      geojson.features[0].geometry.coordinates = [coords.lng, coords.lat];
      map.getSource('point').setData(geojson);
    }

    function onUp(e) {
      pointerCoords = e.lngLat;

      // Print the coordinates of where the point had
      // finished being dragged to on the map.
      coordinates.style.display = 'block';
      coordinates.innerHTML = `
      λ: ${pointerCoords.lng}<br />
      φ: ${pointerCoords.lat}`;
      canvas.style.cursor = '';

      // Unbind mouse/touch events
      map.off('mousemove', onMove);
      map.off('touchmove', onMove);
    }

    map.on('load', () => {
      // Add a single point to the map
      map.addSource('point', {
        type: 'geojson',
        data: geojson,
      });

      map.addLayer({
        id: 'point',
        type: 'circle',
        source: 'point',
        paint: {
          'circle-radius': 8,
          'circle-color': '#6acda7',
        },
      });

      // When the cursor enters a feature in the point layer, prepare for dragging.
      map.on('mouseenter', 'point', () => {
        map.setPaintProperty('point', 'circle-color', '#e68260');
        canvas.style.cursor = 'move';
      });

      map.on('mouseleave', 'point', () => {
        map.setPaintProperty('point', 'circle-color', '#6acda7');
        canvas.style.cursor = '';
      });

      map.on('mousedown', 'point', (e) => {
        // Prevent the default map drag behavior.
        e.preventDefault();

        canvas.style.cursor = 'grab';

        map.on('mousemove', onMove);
        map.once('mouseup', onUp);
      });

      map.on('touchstart', 'point', (e) => {
        if (e.points.length !== 1) return;

        // Prevent the default map drag behavior.
        e.preventDefault();

        map.on('touchmove', onMove);
        map.once('touchend', onUp);
      });
    });
  }

//localite the user position


const geolocateMe = () => {
  let actualUserPosition={}
   return new Promise( (resolve, reject) => {
    
     
     if (navigator.geolocation) {
   
       navigator.geolocation.getCurrentPosition((position) => {
         resolve(
           actualUserPosition={
           lng: position.coords.longitude,
           lat: position.coords.latitude});
           return actualUserPosition
          
       }, () => reject('Error in the geolocation service.'));
     } else {
       reject('Browser does not support geolocation.');
     }
   })
 }

geolocateMe();


}, false);


