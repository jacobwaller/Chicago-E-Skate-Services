import { Context, Markup, NarrowedContext, Types } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { ConversationCategory, UserData } from '../utils/types';
import { addCharge, getCharge } from './chargeHandlers';
import { getUserById, updateUser } from './dbHandlers';

export const cancelKeyboard = Markup.inlineKeyboard([
  Markup.button.callback('🛑 Cancel', '🛑 Cancel'),
]);

export const yesNoKeyboard = Markup.keyboard([
  ['✅ Yes', '❎ No'],
  ['🛑 Cancel'],
])
  .oneTime()
  .resize();

export const endConversation = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['callback_query']>,
  next: () => Promise<void>,
) => {
  console.log('ending conversation');
  const id = ctx.from?.id;
  if (id === undefined) {
    await ctx.reply('Something went wrong. Try again later');
    return await next();
  }
  const user = await getUserById(`${id}`);
  user.conversationalStep = undefined;
  await updateUser(user);

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
  console.log(
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
