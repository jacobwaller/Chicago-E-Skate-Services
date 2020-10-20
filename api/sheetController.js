const { google } = require("googleapis");
const moment = require("moment-timezone");

const NUM_RIDES = 5;

/**
 * Returns a list of the next NUM_RIDES rides
 */
const listRides = async () => {
  const list = await getListOfRides();
  const currentDate = moment();
  currentDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

  //Only fetch rides in future
  const futureRides = list.filter((ride) => {
    const date = moment(ride.date, "MM/DD/YYYY");
    return currentDate <= date;
  });

  //Sort by date from next to future
  futureRides.sort((a, b) => {
    const aDate = moment(a.date, "MM/DD/YYYY");
    const bDate = moment(b.date, "MM/DD/YYYY");

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

const getRide = async (id) => {
  const ret = await listRides();
  if (id < 0 || id >= ret.length) return {};
  return ret[id];
};

function getJwt() {
  var credentials = require("./credentials.json");
  return new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ["https://www.googleapis.com/auth/spreadsheets"]
  );
}

function getApiKey() {
  var apiKeyFile = require("./api_key.json");
  return apiKeyFile.key;
}

/**
 * Returns a list of all rides in the google sheet
 */
const getListOfRides = async () => {
  const sheets = google.sheets({ version: "v4" });
  const results = await sheets.spreadsheets.values.get({
    spreadsheetId: "1SAssru-78PhVGSw_j-igSnmHKlxr5NsuRSZTjxgORxA",
    range: "Rides!A2:G",
    auth: getJwt(),
    key: getApiKey(),
  });

  const rows = results.data.values;
  //Map rows to a list of objects
  const list = rows.map((row) => {
    return {
      date: row[0],
      time: row[1],
      city: row[2],
      startPoint: row[3],
      endPoint: row[4],
      type: row[5],
      routeLink: row[6],
      description: row[7],
    };
  });

  return list;
};

module.exports = { listRides, getRide };
