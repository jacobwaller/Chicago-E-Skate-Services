import { Context, NarrowedContext, Types } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { ConversationCategory, UserData } from '../utils/types';
import { addCharge, getCharge } from './chargeHandlers';

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
