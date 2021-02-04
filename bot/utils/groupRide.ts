import axios from 'axios';
import { Context } from 'telegraf';
import { ApiResponse } from './types';

/**
 * Gets the next group ride and returns the formatted string
 * @param ctx Telegram context
 */
const getGroupRide = async (ctx: Context): Promise<string> => {
  // Call API
  console.log('Calling API with url', process.env.API_URL);
  const axiosResponse = await axios.get<ApiResponse>(
    `${process.env.API_URL}?id=0`
  );
  const response = axiosResponse.data;
  console.log('Recieved', response);
  if (Object.keys(response).length != 0) {
    return (
      `${response.title} (${response.group}):\n` +
      `Date: ${response.date}\n` +
      `Meet At: ${response.meetTime}\n` +
      `Depart At: ${response.launchTime}\n` +
      `From: ${response.startPoint}\n` +
      `To: ${response.endPoint}\n` +
      `Route: ${response.routeLink} (${response.routeLink} Miles)\n\n` +
      //
      `${response.description}\n\n` +
      //
      `The ride will be conducted on ${response.type} conditions, so make sure your vehicle can handle that terrain.\n\n` +
      //
      `Arrive to the start point with enough charge to follow the route.\n\n` +
      //
      `DON'T FORGET YOUR HELMET!`
    );
  } else {
    return 'There are currently no group rides planned';
  }
};

export default getGroupRide;
