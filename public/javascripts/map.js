document.addEventListener('DOMContentLoaded', () => {
  let pointerCoords = '';
  const initialDefaultCoords = {
    lng: -3.703790,
    lat: 40.416775,
  };
  let geocodeLocation = {
    lng: 0,
    lat: 0,
  };
  const coordinates = document.getElementById('coordinates');
  // let markerEvent = null;
  mapboxgl.accessToken = token;
  const map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/light-v9', // stylesheet location
    center: [-3.703790, 40.416775], // starting position [lng, lat]
    zoom: 11, // starting zoom
    // bearing: 29,
  });


  map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
  }));

  drawDragPoint();


  // const addMarker = (title, position, map) => {
  //   return new google.maps.Marker({
  //     position,
  //     map,
  //     title
  //   });
  // }


  document.getElementById('btn-search').onclick = function () {
  /*   if (markerEvent != null) {
      console.log(markerEvent);
      console.log('ENTRAS EN MARKER EVENTS');
      markerEvent.remove();
    }
 */
    // If search without moving the point of geolocate automatic then location by defaults
    let searchLocation = initialDefaultCoords;
    // If geolocated with browser then search in gps coordintes
    if (geocodeLocation.lng !== 0 && geocodeLocation.lat !== 0) {
      console.log('***************++ENTRA EN GPS');
      searchLocation = geocodeLocation;
    }
    if (pointerCoords) {
      console.log('***************++ENTRA EN PUNTERO');
      // If pointer is moved to a position by click or by geolocate then take those coordinates
      searchLocation = pointerCoords;
    }

    const keyValue = document.querySelector('#key-value').value;
    let startDate = document.querySelector('#start-date').value;
    startDate += 'T10:00:00Z';
    let endDate = document.querySelector('#end-date').value;
    endDate += 'T10:00:00Z';
    const radius = document.querySelector('#radius').value;
    const formData = {
      keyValue,
      startDate,
      endDate,
      radius,
      searchLocation,
    };
    axios.post('/events/eventsmap', {
      formData,
    }).then((geojsonData) => {
      const geojson = geojsonData.data.geojson;
      // add markers to map
      console.log(geojson);
      geojson.features.forEach((marker) => {
        const same = [];
        geojson.features.forEach((subMarker) => {
          const coordMain = marker.geometry.coordinates;
          const coordSub = subMarker.geometry.coordinates;
          const idMain = marker.properties.eventId;
          const idSub = subMarker.properties.eventId;

          if (coordMain[0] === coordSub[0] && coordMain[1] === coordSub[1] && idMain !== idSub) {
            same.push(subMarker);
          }
        });

        // console.log('Eventos iguales: ', same);
        // Generate Html for popup if one event in the same coord only one html generated, in case more events have the same coord write sevetal coordinates.

        generteHtml = function (markProp) {
          return `
          <div class="pop-up">
            <h1 class="event-name">${markProp.properties.eventName}</h1>
            <label>Place:</label><p class="event-place-name">${markProp.properties.eventPlaceName}</p>
            <a class="event-url" href="${markProp.properties.eventUrl}">BUY</a>
            <span class="event-price">${markProp.properties.eventPrice}€</span>
            <span class="event-date">${markProp.properties.eventDate}</span>
            <span class="event-time">${markProp.properties.eventTime}</span>
            <span class="event-id">${markProp.properties.eventId}</span>
            <img src="${markProp.properties.eventImage}" class="event-img">
            <span class="event-lng">${markProp.geometry.coordinates[0]}</span>
            <span class="event-lat">${markProp.geometry.coordinates[1]}</span>
            <a class="fav-btn">Add to Favourite</a>
          </div>`;
        };

        // *********

        let html = generteHtml(marker);

        same.forEach((event) => {
          html += generteHtml(event);
        });


        // create a HTML element for each feature
        const el = document.createElement('div');
        el.className = 'marker';
        // make a marker for each feature and add to the map

        markerEvent = new mapboxgl.Marker(el)
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
    navigator.geolocation.getCurrentPosition(
      (success) => {
        /* Location tracking code */
        geocodeLongitude = success.coords.longitude;
        geocodeLatitude = success.coords.latitude;
        geocodeLocation = {
          lng: geocodeLongitude,
          lat: geocodeLatitude,
        };
        console.log(geocodeLongitude);
        console.log(geocodeLatitude);

        map.removeLayer('point');
        map.removeSource('point');

        const geojson2 = {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [geocodeLongitude, geocodeLatitude],
            },
          }],
        };
        map.addSource('point', {
          type: 'geojson',
          data: geojson2,
        });
        map.addLayer({
          id: 'point',
          type: 'circle',
          source: 'point',
          paint: {
            'circle-radius': 8,
            'circle-color': '#e68260',
          },
        });
      },
      (failure) => {
        if (failure.message.indexOf('Only secure origins are allowed') == 0) {
          alert('Only secure origins are allowed by your browser.');
        }
      },
    );
    //  By default paint point in initial coordinates
    const canvas = map.getCanvasContainer();
    const geojson = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [initialDefaultCoords.lng, initialDefaultCoords.lat],
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
          'circle-color': '#e68260',
        },
      });

      // When the cursor enters a feature in the point layer, prepare for dragging.
      map.on('mouseenter', 'point', () => {
        map.setPaintProperty('point', 'circle-color', '#6acda7');
        canvas.style.cursor = 'move';
      });

      map.on('mouseleave', 'point', () => {
        map.setPaintProperty('point', 'circle-color', '#e68260');
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

  // Get values from pop up cause we dont have DOM element to click till popup is shown
  $('body').on('click', '.fav-btn', (e) => {
    console.log($(e.currentTarget).parent().find('.event-lng')[0]);
    const eventName = $(e.currentTarget)
      .parent()
      .find('.event-name')[0]
      .innerHTML;
    const eventPlaceName = $(e.currentTarget)
      .parent()
      .find('.event-place-name')[0]
      .innerHTML;
    const eventUrl = $(e.currentTarget)
      .parent()
      .find('.event-url')[0].getAttribute('href');
    const eventDate = $(e.currentTarget)
      .parent()
      .find('.event-date')[0].innerHTML;
    const eventTime = $(e.currentTarget)
      .parent()
      .find('.event-time')[0].innerHTML;
    const eventImg = $(e.currentTarget)
      .parent()
      .find('.event-img')[0].getAttribute('src');
    const eventLng = $(e.currentTarget)
      .parent()
      .find('.event-lng')[0].innerHTML;
    const eventLat = $(e.currentTarget)
      .parent()
      .find('.event-lat')[0].innerHTML;
    const eventId = $(e.currentTarget)
      .parent()
      .find('.event-id')[0]
      .innerHTML;
    $.ajax({
      contentType: 'application/json',
      dataType: 'json',
      type: 'POST',
      url: '/events/myevents',
      data: JSON.stringify({
        eventName: `${eventName}`,
        eventPlaceName: `${eventPlaceName}`,
        eventUrl: `${eventUrl}`,
        eventDate: `${eventDate}`,
        eventTime: `${eventTime}`,
        eventImg: `${eventImg}`,
        eventLng: `${eventLng}`,
        eventLat: `${eventLat}`,
        eventId: `${eventId}`,
      }),
    }).done(() => {
      console.log('Post received from back server');
      $(e.currentTarget).css({
        color: 'red',
      });
    });
  });
}, false);
