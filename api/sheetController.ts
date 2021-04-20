import { google } from 'googleapis';
import moment from 'moment-timezone';
import { Base64 } from 'js-base64';
require('dotenv').config();

const NUM_RIDES = 5;

const getJwt = () => {
  return new google.auth.JWT(
    process.env.CLIENT_EMAIL,
    undefined,
    Base64.decode(process.env.PRIVATE_KEY || ''),
    ['https://www.googleapis.com/auth/spreadsheets'],
  );
};

const getApiKey = () => {
  return process.env.API_KEY;
};

/**
 * Returns a list of all rides in the google sheet
 */
const getListOfRides = async () => {
  const sheets = google.sheets({ version: 'v4' });
  const results = await sheets.spreadsheets.values.get({
    spreadsheetId: '1SAssru-78PhVGSw_j-igSnmHKlxr5NsuRSZTjxgORxA',
    range: 'Rides!A3:K',
    auth: getJwt(),
    key: getApiKey(),
  });

  const rows = results.data.values;
  if (rows === null || rows === undefined) {
    return [];
  }
  //Map rows to a list of object
  const list = rows.map((row) => {
    return {
      title: row[0],
      date: row[1],
      meetTime: row[2],
      launchTime: row[3],
      group: row[4],
      startPoint: row[5],
      endPoint: row[6],
      type: row[7],
      routeLink: row[8],
      routeDistance: row[9],
      description: row[10],
    };
  });

  return list;
};

/**
 * Returns a list of the next NUM_RIDES rides
 */
export const listRides = async () => {
  const list = await getListOfRides();
  const currentDate = moment();
  currentDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

  //Only fetch rides in future
  const futureRides = list.filter((ride) => {
    const date = moment(ride.date, 'MM/DD/YYYY');
    return currentDate <= date;
  });

  //Sort by date from next to future
  futureRides.sort((a, b) => {
    const aDate = moment(a.date, 'MM/DD/YYYY');
    const bDate = moment(b.date, 'MM/DD/YYYY');

    if (aDate < bDate) {
      return -1;
    } else if (aDate > bDate) {
      return 1;
    } else {
      return 0;
    }
  });

  return futureRides.slice(0, NUM_RIDES);
};

export const getRide = async (id: number) => {
  const ret = await listRides();
  if (id < 0 || id >= ret.length) return {};
  return ret[id];
};
