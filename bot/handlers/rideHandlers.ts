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
  // Needs to be responding to a msg recently enough
  if (ctx.callbackQuery.message && 'text' in ctx.callbackQuery.message) {
    const matchedArr = ctx.callbackQuery.message.text.match(/=\d+,\d+=/);
    if (!matchedArr) {
      await ctx.reply('Something went wrong... code 0');
    } else {
      const buttonUserId = ctx.callbackQuery.from.id;
      const matchedStr = matchedArr[matchedArr.length - 1];

      // splits =123,0= into 123 & 0
      const originalCaller = parseInt(matchedStr.split(/,|=/)[1]);
      const sentIndex = parseInt(matchedStr.split(/,|=/)[2]);

      if (buttonUserId === originalCaller) {
        const newIdx = sentIndex - 1 < 0 ? 0 : sentIndex - 1;
        const str =
          (await getGroupRide(newIdx)) + `\n=${originalCaller},${newIdx}=`;

        await ctx.editMessageText(str, {
          reply_markup: prevNextKeyboard.reply_markup,
        });
      } else {
        await ctx.answerCbQuery(
          'Only the original sender can use the buttons. Send a /ride to go through the rides yourself',
        );
        return await next();
      }
    }
  } else {
    ctx.editMessageText('Something went wrong... code 1');
  }
  await ctx.answerCbQuery();
  return await next();
};

export const nextCallback = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['callback_query']>,
  next: () => Promise<void>,
) => {
  // Needs to be responding to a msg recently enough
  if (ctx.callbackQuery.message && 'text' in ctx.callbackQuery.message) {
    const matchedArr = ctx.callbackQuery.message.text.match(/=\d+,\d+=/);
    if (!matchedArr) {
      await ctx.reply('Something went wrong... code 0');
    } else {
      const buttonUserId = ctx.callbackQuery.from.id;
      const matchedStr = matchedArr[matchedArr.length - 1];

      // splits =123,0= into 123 & 0
      const originalCaller = parseInt(matchedStr.split(/,|=/)[1]);
      const sentIndex = parseInt(matchedStr.split(/,|=/)[2]);

      if (buttonUserId === originalCaller) {
        const str =
          (await getGroupRide(sentIndex + 1)) +
          `\n=${originalCaller},${sentIndex + 1}=`;

        await ctx.editMessageText(str, {
          reply_markup: prevNextKeyboard.reply_markup,
        });
      } else {
        await ctx.answerCbQuery(
          'Only the original sender can use the buttons. Send a /ride to go through the rides yourself',
        );
        return await next();
      }
    }
  } else {
    ctx.editMessageText('Something went wrong... code 1');
  }
  await ctx.answerCbQuery();
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
    return `There are currently no group rides planned for index ${index}`;
  }
};

export const ride = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['text']>,
) => {
  await ctx.replyWithChatAction('typing');

  const str = (await getGroupRide(0)) + `\n=${ctx.from.id},0=`;

  return await ctx.reply(str, {
    reply_markup: prevNextKeyboard.reply_markup,
  });
};
