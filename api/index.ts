import {
  listRides,
  getRide,
  addChargingSpot,
  getChargingSpots,
} from './sheetController';
import Express from 'express';
import { ChargingSpot } from './types';

const chargingHandler = async (req: Express.Request, res: Express.Response) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  if (req.method === 'GET') {
    const lat = req.params.lat;
    const lon = req.params.lon;
    if (lat === undefined || lon === undefined) {
      res.status(400).send("Error: Must supply params 'lat' and 'lon'");
    } else {
      const results: Array<ChargingSpot> = await getChargingSpots(
        parseFloat(lat),
        parseFloat(lon),
        3,
      );
      res.status(200).send(JSON.stringify(results));
    }
  } else if (req.method === 'POST') {
    const body: ChargingSpot = req.body;
    if (
      body.lat == undefined ||
      body.lon == undefined ||
      body.addedBy == undefined ||
      body.description == undefined ||
      body.title == undefined
    ) {
      res.status(400).send('Error: Body in incorrect format');
    } else {
      const results = addChargingSpot(body);
      if (results) {
        res.status(200).send('Success');
      } else {
        res.status(500).send('Error: Something went wrong');
      }
    }
  } else {
    res.status(400).send('Error: wrong method');
  }
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
