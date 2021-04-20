import { listRides, getRide } from './sheetController';
import Express from 'express';

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

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
// const chargingPoints = async (req, res) => {
//   res.set('Access-Control-Allow-Origin', '*');
//   res.set('Access-Control-Allow-Methods', 'GET, POST');

//   // Create a new charging point
//   if (req.method === 'POST') {
//     const body = req.body;
//     const status = createNewChargePoint(body);
//     if (status) {
//       res.status(200).send(JSON.stringify(status));
//     } else {
//       res.status(400).send('Something went wrong');
//     }
//   } else if (req.method === 'GET') {
//     const lat = req.query.lat;
//     const lon = req.query.lon;
//     const n = req.query.number;
//     if (lat === undefined || lon === undefined || n == undefined) {
//       res.status(400).send('Error: Wrong query params');
//     } else {
//       const status = getNClosestChargePoints(lat, lon, n);
//       if (status) {
//         res.status(200).send(JSON.stringify(status));
//       } else {
//         res.status(400).send('Something went wrong');
//       }
//     }
//   } else {
//     res.status(400).send('Error: wrong method');
//   }
// };

module.exports = { fetchRide };
