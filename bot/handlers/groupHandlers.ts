import { Context, NarrowedContext, Types } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { MAIN_GROUP_ID, GROUP_IDS } from '../utils/ids';
import QRCode from 'qrcode';
import { getUserById } from './dbHandlers';
import logger from './logHandler';

export const group = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['text']>,
) => {
  const pevInvite = await ctx.telegram.exportChatInviteLink(MAIN_GROUP_ID);
  const restInvites: String[] = [];

  const userId = `${ctx.from.id}`;
  const user = await getUserById(userId);

  if(ctx.chat.type === 'private') {
    return await ctx.reply("Unfortunately, due to recent AI Slop Spam, this must be done in a group. Please re-send this inside a group chat.")
  }

  logger.info(`Creating group invite links for ${userId}. Links. PEV: ${pevInvite}, others: ${restInvites}`)

  for (let i = 0; i < GROUP_IDS.length; i++) {
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
    `[Chicago EUC](${restInvites[1]})\n\n` +
    `[Discord](https://discord.gg/8TvtZSYCrs)`
    ;
  return await Promise.all([ctx.reply(msg, { parse_mode: 'MarkdownV2' }), ctx.replyWithPhoto({ source: await QRCode.toBuffer(pevInvite) })]);
};
