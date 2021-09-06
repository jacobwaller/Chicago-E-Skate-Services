import { Context, NarrowedContext, Types } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { ConversationCategory, UserData } from '../utils/types';
import { charge } from './chargeHandler';

export default async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['message']>,
  next: () => Promise<void>,
  user: UserData,
) => {
  // Not in convo
  if (!user.conversationalStep) {
    return await next();
  }
  console.log(
    'Trying to handle conversation: ',
    JSON.stringify(user.conversationalStep),
  );
  // In charge convo
  if (user.conversationalStep.category === ConversationCategory.CHARGE) {
    return await charge(ctx, next, user);
  }

  return await next();
};
