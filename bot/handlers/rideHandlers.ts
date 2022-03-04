import axios from 'axios';
import { Context, NarrowedContext, Types } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { ApiResponse } from '../utils/types';

export const getGroupRide = async (): Promise<string> => {
  // Call API
  console.log('Calling API with url', process.env.API_URL);
  const axiosResponse = await axios.get<ApiResponse>(
    `${process.env.API_URL}?id=0`,
  );
  const response = axiosResponse.data;
  console.log('Recieved', response);
  if (Object.keys(response).length != 0) {
    return (
      `${response.title} (${response.group}):\n\n` +
      //
      `When: ${response.date} at ${response.meetTime}\n` +
      `From: ${response.startPoint}\n` +
      `To: ${response.endPoint}\n` +
      `Route: ${response.routeLink} (${response.routeDistance} Miles) in ${response.type} conditions\n\n` +
      //
      `${response.description}\n\n` +
      //
      `DON'T FORGET YOUR HELMET!`
    );
  } else {
    return 'There are currently no group rides planned';
  }
};

export const ride = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['text']>,
) => {
  await ctx.replyWithChatAction('typing');
  return await ctx.reply(await getGroupRide());
};
