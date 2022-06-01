import axios from 'axios';
import { Context, Markup, NarrowedContext, Types } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { ApiResponse } from '../utils/types';

export const prevNextKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback('⏮️', '⏮️'), Markup.button.callback('⏭️', '⏭️')],
]);

export const prevCallback = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['callback_query']>,
  next: () => Promise<void>,
) => {
  console.log('saying prev');

  ctx.editMessageText('edited prev');

  return await next();
};

export const nextCallback = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['callback_query']>,
  next: () => Promise<void>,
) => {
  console.log('saying next');

  ctx.editMessageText('edited next');

  return await next();
};

export const getGroupRide = async (index: number): Promise<string> => {
  // Call API
  console.log('Calling API with url', process.env.API_URL);
  const axiosResponse = await axios.get<ApiResponse>(
    `${process.env.API_URL}?id=${index}`,
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
  return await ctx.reply(await getGroupRide(0), {
    reply_to_message_id: ctx.message.message_id,
    reply_markup: prevNextKeyboard.reply_markup,
  });
};
