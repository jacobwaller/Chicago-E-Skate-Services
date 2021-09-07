import {
  listRides,
  getRide,
  addChargingSpot,
  getChargingSpots,
} from './sheetController';
import Express from 'express';

const chargingHandler = async (req: Express.Request, res: Express.Response) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET');
  // key is not secret because usage is free and in most situations, this would be visible on the front end
  const ret = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Simple Map</title>
      <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
      <style>
        #map {
          height: 100%;
        }
        html,
        body {
          height: 100%;
          margin: 0;
          padding: 0;
        }
      </style>
      let map;
      function initMap() {
        map = new google.maps.Map(document.getElementById("map"), {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 8,
        });
      }
      <script>

      </script>
    </head>
    <body>
      <div id="map"></div>
      <script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC5ZXwvHY1T9HulHnO6arlUq4291WPdJRM&callback=initMap&libraries=&v=weekly"
        async
      ></script>
    </body>
  </html>
  `;

  res.status(200).send(ret);
};

const fetchRide = async (req: Express.Request, res: Express.Response) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET');
  if (req.method === 'GET') {
    const id = req.query.id;
    if (id === undefined) {
      res.status(200).send(await listRides());
    } else {
      res.status(200).send(await getRide(parseInt(id.toString())));
    }
  } else {
    res.status(400).send('Error: wrong method');
  }
};

module.exports = { fetchRide, chargingHandler };
