import { Context, Markup, NarrowedContext, Types } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import {
  ChargeSteps,
  ChargeType,
  ConversationCategory,
  UserData,
} from '../utils/types';
import { addCharge, getCharge } from './chargeHandlers';
import { getUserById, updateUser } from './dbHandlers';
import logger from './logHandler';

export const cancelKeyboard = Markup.inlineKeyboard([
  Markup.button.callback('🛑 Cancel', '🛑 Cancel'),
]);

export const yesNoKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('✅ Yes', '✅ Yes'),
    Markup.button.callback('❎ No', '❎ No'),
  ],
  [Markup.button.callback('🛑 Cancel', '🛑 Cancel')],
]);

export const endConversation = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['callback_query']>,
  next: () => Promise<void>,
) => {
  logger.info('ending conversation');
  const id = ctx.from?.id;
  if (id === undefined) {
    await ctx.reply('Something went wrong. Try again later');
    return await next();
  }
  const user = await getUserById(`${id}`);
  user.conversationalStep = undefined;
  await updateUser(user);

  logger.info('CALLBACK:', JSON.stringify(ctx.callbackQuery));

  // Remove the button from the message
  await ctx.telegram.editMessageReplyMarkup(
    ctx.callbackQuery.message?.chat.id,
    ctx.callbackQuery.message?.message_id,
    undefined,
    undefined,
  );
  await ctx.reply("Okay! I've cancelled the conversation.");
  return await next();
};

export const yesCallback = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['callback_query']>,
  next: () => Promise<void>,
) => {
  logger.info('saying yes');
  const id = ctx.from?.id;
  if (id === undefined) {
    await ctx.reply('Something went wrong. Try again later');
    return await next();
  }
  const user = await getUserById(`${id}`);
  if (user.conversationalStep === undefined) {
    await ctx.reply('User is not having conversation... Something went wrong');
    return await next();
  }

  user.conversationalStep.state.indoors = ChargeType.INDOOR;
  user.conversationalStep.stepInfo = ChargeSteps.Description;
  await updateUser(user);

  // Remove the button from the message
  await ctx.telegram.editMessageReplyMarkup(
    ctx.callbackQuery.message?.chat.id,
    ctx.callbackQuery.message?.message_id,
    undefined,
    undefined,
  );
  await ctx.reply(
    `Sweet. I've got that as indoors. Last step, send a quick description of where this location is. For example, is it inside a business? on a light pole? etc`,
    cancelKeyboard,
  );
  return await next();
};

export const noCallback = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['callback_query']>,
  next: () => Promise<void>,
) => {
  logger.info('saying no');
  const id = ctx.from?.id;
  if (id === undefined) {
    await ctx.reply('Something went wrong. Try again later');
    return await next();
  }
  const user = await getUserById(`${id}`);
  if (user.conversationalStep === undefined) {
    await ctx.reply('User is not having conversation... Something went wrong');
    return await next();
  }

  user.conversationalStep.state.indoors = ChargeType.OUTDOOR;
  user.conversationalStep.stepInfo = ChargeSteps.Description;
  await updateUser(user);

  // Remove the button from the message
  await ctx.telegram.editMessageReplyMarkup(
    ctx.callbackQuery.message?.chat.id,
    ctx.callbackQuery.message?.message_id,
    undefined,
    undefined,
  );
  await ctx.reply(
    `Sweet. I've got that as outdoors. Last step, send a quick description of where this location is. For example, is it inside a business? on a light pole? etc`,
    cancelKeyboard,
  );
  return await next();
};

export default async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['message']>,
  next: () => Promise<void>,
  user: UserData,
) => {
  // Not in convo
  if (!user.conversationalStep) {
    return await next();
  }
  await ctx.replyWithChatAction('typing');
  logger.info(
    'Trying to handle conversation: ',
    JSON.stringify(user.conversationalStep),
  );
  // In charge convo
  if (user.conversationalStep.category === ConversationCategory.ADD_CHARGE) {
    return await addCharge(ctx, next, user);
  }

  if (user.conversationalStep.category === ConversationCategory.GET_CHARGE) {
    return await getCharge(ctx, next, user);
  }
  return await next();
};
