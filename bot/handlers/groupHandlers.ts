import { Context, NarrowedContext, Types } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { MAIN_GROUP_ID, GROUP_IDS } from '../utils/ids';

export const group = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['text']>,
) => {
  const pevInvite = await ctx.telegram.exportChatInviteLink(MAIN_GROUP_ID);
  const restInvites = [];

  for (let i = 0; i < 3; i++) {
    const id = GROUP_IDS[i];
    const link = await ctx.telegram.exportChatInviteLink(id);
    restInvites.push(link);
  }

  const msg =
    'Facebook Groups:\n' +
    '[Chicago PEV](https://www.facebook.com/groups/chicagoeskate/)\n' +
    '[Chicago Onewheel](facebook.com/groups/chicagoonewheel/)\n' +
    '[Chicago EUC](https://www.facebook.com/groups/chicagoeuc/)\n' +
    '\n' +
    'Telegram Groups:\n' +
    `[Chicago PEV](${pevInvite})\n` +
    `[Chicago Onewheel](${restInvites[0]})\n` +
    `[Chicago EUC](${restInvites[1]})\n`;

  return await ctx.reply(msg, { parse_mode: 'MarkdownV2' });
};
