import { Context, Telegraf } from 'telegraf';
import axios from 'axios';
import { HttpFunction } from '@google-cloud/functions-framework/build/src/functions';

import { basicCommands, commands } from './utils/commands';

import groupRide from './utils/groupRide';
import newChatMembers from './utils/newChatMembers';
import randomGif from './utils/randomGif';

const { BOT_TOKEN, PROJECT_ID, FUNCTION_NAME, REGION } = process.env;

const bot = new Telegraf(BOT_TOKEN);

bot.telegram.setWebhook(
  `https://${REGION}-${PROJECT_ID}.cloudfunctions.net/${FUNCTION_NAME}`
);

basicCommands.forEach((item) => {
  bot.command(item.commands, (ctx) => ctx.reply(item.response));
});

bot.command(commands.groupRide, async (ctx) => ctx.reply(await groupRide(ctx)));
bot.command(commands.random, async (ctx) => await randomGif(ctx));

bot.on('new_chat_members', (ctx) => newChatMembers(ctx));

export const botFunction: HttpFunction = async (req, res) => {
  console.log(req.body);
  try {
    // Handle the update
    await bot.handleUpdate(req.body);
    console.log('Success');
    res.status(200).send('Success');
  } catch (err) {
    console.log('Failure');
    console.log(err);
    res.status(500).send('Something went wrong');
  }
};
