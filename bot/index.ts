import { Telegraf } from 'telegraf';
import { HttpFunction } from '@google-cloud/functions-framework/build/src/functions';

import { basicCommands, commands } from './utils/commands';

import groupRide from './utils/groupRide';
import randomGif from './utils/randomGif';

const { BOT_TOKEN, PROJECT_ID, FUNCTION_NAME, REGION } = process.env;

const bot = new Telegraf(BOT_TOKEN || '');

bot.telegram.setWebhook(
  `https://${REGION}-${PROJECT_ID}.cloudfunctions.net/${FUNCTION_NAME}`,
);

basicCommands.forEach((item) => {
  bot.command(item.commands, (ctx) => ctx.reply(item.response));
});

bot.command(commands.groupRide, async (ctx) => ctx.reply(await groupRide()));
bot.command(commands.random, async (ctx) => await randomGif(ctx));

bot.on('new_chat_members', (ctx) => {
  let name = 'new member';

  if ('from' in ctx) {
    const user = ctx.from;
    if ('first_name' in user) {
      name = user.first_name;
    } else if ('username' in user) {
      name = user.username;
    }
  }

  const welcomeString =
    `Hello, ${name} Welcome to the Chicago E-Skate Network\n` +
    `Make sure to also join the main Chicago E-Skate Channel at: https://t.me/joinchat/NP_fsHcrXehkY2Qx\n` +
    `For info on the next group ride, click: /group_ride\n` +
    `For more info on the group go to chicagoeskate.com\n` +
    `Also, make sure you look at the Group Ride Guidelines by clicking: /rules\n`;

  return ctx.reply(welcomeString);
});

export const botFunction: HttpFunction = async (req, res) => {
  console.log(req.body);
  try {
    // Handle the update
    await bot.handleUpdate(req.body);
    console.log('Success');
    res.status(200).send('Success');
  } catch (err) {
    console.log('Issue with Telegram API');
    res.status(200).send('Issue with Telegram API');
  }
};
