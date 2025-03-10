import {
  listRides,
  getRide,
  addChargingSpot,
  getChargingSpots,
  getLeaderboard,
} from './sheetController';
import Express from 'express';
import { Firestore } from '@google-cloud/firestore';
import { Base64 } from 'js-base64';
import { ChargeSpot } from '../bot/utils/types';
import ical, { ICalTimezone } from 'ical-generator';
import moment from 'moment-timezone';

let _db: Firestore;

const db = () => {
  if (_db === undefined) {
    const tokenInfo = Base64.decode(process.env.FIRESTORE_TOKEN || '');
    const tokenObject = JSON.parse(tokenInfo);
    const clientEmail = tokenObject.client_email;
    const privateKey = tokenObject.private_key;

    _db = new Firestore({
      projectId: process.env.PROJECT_ID,
      ignoreUndefinedProperties: true,
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    });
  }
  return _db;
};

const getChargeSpots = async () => {
  const dat = await db().collection('charge').get();
  const ret: Array<ChargeSpot> = [];
  dat.forEach((item) => {
    ret.push(item.data() as ChargeSpot);
  });
  return ret;
};

const createSpotEntry = (spot: ChargeSpot): string => {
  return `[{ lat: ${spot.lat}, lng: ${spot.lon} }, "${spot.description}"]`;
};

const createArrayString = (spots: Array<ChargeSpot>): string => {
  return `
    const chargeSpots = [
      ${spots.map((spot) => createSpotEntry(spot)).join(',\n')}
    ]
  `;
};

// const createMarkerText = (spot: ChargeSpot): string => {
//   return `
//     marker = new google.maps.Marker({
//       position: {
//         lat: ${spot.lat},
//         lng: ${spot.lon}
//       },
//       title: "${spot.description}",
//       map,
//       optimized: false,
//     });

//     marker.addListener("click", () => {
//       infoWindow.close();
//       infoWindow.setContent(marker.getTitle());
//       infoWindow.open(marker.getMap(), marker);
//     });
//   `;
// };

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
          const infoWindow = new google.maps.InfoWindow();
          // const chargeSpots = ...
          ${createArrayString(spots)}
          chargeSpots.forEach(([position, title], i) => {
            const marker = new google.maps.Marker({
              position,
              map,
              title: \`\${title}\`,
              optimized: false,
            });
            // Add a click listener for each marker, and set up the info window.
            marker.addListener("click", () => {
              infoWindow.close();
              infoWindow.setContent(marker.getTitle());
              infoWindow.open(marker.getMap(), marker);
            });
          });
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

const getCalendar = async () => {
  console.log('Starting to generate calendar...');
  const allRides = await listRides();
  const calendar = ical({
    name: 'Chicago E-Skate Group Rides',
    timezone: 'America/Chicago',
  });
  console.log('Fetched data');
  allRides.forEach((ride) => {
    console.log('Attempting to add', JSON.stringify(ride));

    const s = moment.tz(
      `${ride.date} ${ride.meetTime}`,
      'MM/DD/YYYY hh:mm a',
      'America/Chicago',
    );

    // prettier-ignore
    const desc =
      `${ride.title} (${ride.group}):\n\n` +
      //
      `When: ${ride.date} at ${ride.meetTime}\n` +
      `Where: ${ride.startPoint}\n` +
      (ride.endPoint ? `To: ${ride.endPoint}\n` : '') + 
      (ride.routeLink ? `Route: ${ride.routeLink} (${ride.routeDistance} Miles) in ` : '') + 
      (ride.type ? `${ride.type} conditions\n` : '') +
      //
      `\n${ride.description}\n` +
      //
      `\nDON'T FORGET YOUR HELMET!`;

    const optionalAttachments: string[] = [];

    const a = calendar.createEvent({
      start: s,
      end: s.clone().add({
        hours: 2,
      }),
      summary: ride.title,
      description: desc,
      location: ride.startPoint,
      url: 'https://chicagoeskate.com',
      timezone: 'America/Chicago',
      attachments: optionalAttachments,
    });

    console.log(`Adding ${a.toString()}`);
  });
  console.log('returning data...');

  return calendar.toString();
};

const fetchRide = async (req: Express.Request, res: Express.Response) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET');
  if (req.method === 'GET') {
    const id = req.query.id;
    if (req.path.includes('charge-spots')) {
      const chargeSpotsList = await getChargeSpots();
      res.status(200).send(
        chargeSpotsList.map((spot) => {
          return {
            lat: spot.lat,
            lon: spot.lon,
            description: spot.description + '\n' + spot.chargeType,
          };
        }),
      );
    } else if (req.path.includes('calendar.ics')) {
      const getCal = await getCalendar();
      res.status(200).send(getCal);
    } else if (req.path.includes('leaderboard')) {
      res.status(200).send(await getLeaderboard());
    } else if (id === undefined) {
      res.status(200).send(await listRides());
    } else {
      res.status(200).send(await getRide(parseInt(id.toString())));
    }
  } else {
    res.status(400).send('Error: wrong method');
  }
};

module.exports = { fetchRide, chargingHandler };
