import { Context, NarrowedContext, Types } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { UserData } from '../utils/types';

export default async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['message']>,
  next: () => Promise<void>,
  user: UserData,
) => {
  // Not in convo
  if (!user.conversationalStep) {
    return await next();
  }
};
