import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';

export default async (
  userId: number,
  chatId: number,
  bot: Telegraf<Context<Update>>,
): Promise<boolean> => {
  const admins = await bot.telegram.getChatAdministrators(chatId);
  const filtered = admins.filter((admin) => {
    return admin.user.id === userId;
  });
  return filtered.length !== 0;
};
