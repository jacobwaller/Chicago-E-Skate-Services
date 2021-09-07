import {
  listRides,
  getRide,
  addChargingSpot,
  getChargingSpots,
} from './sheetController';
import Express from 'express';
import { getChargeSpots } from '../bot/utils/dbHandler';
import { ChargeSpot } from '../bot/utils/types';

const createMarkerText = (spot: ChargeSpot): string => {
  return `
    new google.maps.Marker({
      position: {
        lat: ${spot.lat}, 
        lng: ${spot.lon}
      },
      map,
      title: "${spot.description}",
      label: "${spot.id}",
      optimized: true,
    });
  `;
};

const chargingHandler = async (req: Express.Request, res: Express.Response) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET');
  const spots = await getChargeSpots();

  const ret = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Chicago Charge Map</title>
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

      <script>
        let map;
        function initMap() {
          map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: 41.8781, lng: -87.6298 },
            zoom: 8,
          });

          ${spots
            .map((spot) => {
              createMarkerText(spot);
            })
            .join('\n')}
        }
      </script>
    </head>
    <body>
      <div id="map"></div>
      <script
        src="https://maps.googleapis.com/maps/api/js?key=${
          process.env.MAPS_KEY
        }&callback=initMap&libraries=&v=weekly"
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
