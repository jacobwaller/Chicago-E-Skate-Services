import { Context, NarrowedContext, Types } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { getUserById } from './dbHandlers';

export const myDataHandler = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['text']>,
  next: () => Promise<void>,
) => {
  if (ctx.chat.type !== 'private') {
    return await ctx.reply(
      `This needs to be done in DMs to prevent sharing private info. Please DM me the same command by clicking this: @${ctx.botInfo.username}`,
    );
  }

  const userId = ctx.update.message.from.id;
  const userData = await getUserById(`${userId}`);
  await ctx.reply(`Your data: ${JSON.stringify(userData)}`);
  return await next();
};
