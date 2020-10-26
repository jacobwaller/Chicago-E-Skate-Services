const { listRides, getRide } = require("./sheetController");

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
const fetchRide = async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET");

  if (req.method === "GET") {
    const id = req.query.id;
    if (id === undefined) {
      res.status(200).send(await listRides());
    } else {
      res.status(200).send(await getRide(id));
    }
  } else {
    res.status(400).send("Error: wrong method");
  }
};

module.exports = { fetchRide };
