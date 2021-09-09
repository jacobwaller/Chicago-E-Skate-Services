import { Context, NarrowedContext, Types } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { MAIN_GROUP_ID, GROUP_IDS } from '../utils/ids';

export const group = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['text']>,
) => {
  const eskateInvite = await ctx.telegram.exportChatInviteLink(MAIN_GROUP_ID);
  const restInvites = [];

  for (let i = 0; i < 3; i++) {
    const id = GROUP_IDS[i];
    const link = await ctx.telegram.exportChatInviteLink(id);
    restInvites.push(link);
  }

  const msg =
    'Facebook Groups:\n' +
    '[Chicago E\\-Skate](https://www.facebook.com/groups/chicagoeskate/)\n' +
    '[Chicago E\\-Bike](https://www.facebook.com/groups/665412891024870/)\n' +
    '[Chicago Electric Scooters](https://www.facebook.com/groups/301631767538431/)\n' +
    '[Chicago EUC](https://www.facebook.com/groups/chicagoeuc/)\n' +
    '[Chicago Onewheel](facebook.com/groups/chicagoonewheel/)\n' +
    '\n' +
    'Telegram Groups:\n' +
    `[Chicago E\\-Skate](${eskateInvite})\n` +
    `[Chicago Onewheel](${restInvites[0]})\n` +
    `[Chicago EUC](${restInvites[1]})\n` +
    `[Chicago E\\-Bike](${restInvites[2]})\n`;

  return await ctx.reply(msg, { parse_mode: 'MarkdownV2' });
};
