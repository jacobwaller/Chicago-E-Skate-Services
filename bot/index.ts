import { Telegraf } from 'telegraf';
import { HttpFunction } from '@google-cloud/functions-framework/build/src/functions';

import { basicCommands, commands } from './utils/commands';

import groupRide from './utils/groupRide';
import randomGif from './utils/randomGif';
import { encode, decode } from 'js-base64';

const { BOT_TOKEN, PROJECT_ID, FUNCTION_NAME, REGION } = process.env;

const bot = new Telegraf(BOT_TOKEN || '');

bot.telegram.setWebhook(
  `https://${REGION}-${PROJECT_ID}.cloudfunctions.net/${FUNCTION_NAME}`,
);

basicCommands.forEach((item) => {
  bot.command(item.commands, (ctx) => ctx.reply(item.response));
});

bot.command(['add-location', 'add'], (ctx) => {
  const split = ctx.message.text.split(' ');
  // Error checking for dummies
  if (split.length < 2 || !ctx.message.text.includes('*')) {
    return ctx.reply(
      "Must supply title and description in format /add <title> * <description>. Remember, do not include a '*' in your title or description ",
    );
  } else if (
    ctx.message.text.indexOf('*') !== ctx.message.text.lastIndexOf('*')
  ) {
    return ctx.reply('Please do not include a * in your title or decription');
  }
  const splIndex = split.indexOf('*');

  const title = split.slice(1, splIndex).join(' '); // combine all the strings back together from after /add until the '*'
  const description = split.slice(splIndex + 1).join(' '); // Combine all the strings after '*' to make the description
  if (title.trim() === '') {
    return ctx.reply('Must supply a title');
  } else if (description.trim() === '') {
    return ctx.reply('Must supply a description');
  }

  const str = JSON.stringify({
    title: title,
    description: description,
  });
  const b64 = encode(str);
  return ctx.reply(
    `Awesome! Go ahead and reply to this message with the location of the charging spot. \n${b64}`,
  );
});

bot.on('location', (ctx) => {
  // Needs to be replying to me
  if (
    ctx.message.reply_to_message !== undefined && // Replying to something
    ctx.message.reply_to_message.from !== undefined && // Replying to someone
    ctx.message.reply_to_message.from.id === bot.botInfo?.id && // Replying to me
    'text' in ctx.message.reply_to_message // Make ts happy. If we're at this point, it's definitely a text message
  ) {
    // Check if we're adding location
    const split = ctx.message.reply_to_message.text.split('|');
    if (split.length === 2) {
      const objSoFar = JSON.parse(decode(split[1]));
      const lat = ctx.message.location.latitude;
      const lon = ctx.message.location.longitude;
      objSoFar.lat = lat;
      objSoFar.lon = lon;
      // Make API Request. Instead, just post it
      return ctx.reply(JSON.stringify(objSoFar, undefined, 2));
    }

    // Check if we're requesting locations
  } else {
    // not replying to me, need to handle anyway
    return ctx.reply(
      'This is a temporary addition until i can make this better',
    );
  }
});

bot.command(commands.groupRide, async (ctx) => ctx.reply(await groupRide()));
bot.command(commands.random, async (ctx) => await randomGif(ctx));

bot.on('new_chat_members', (ctx) => {
  let name = ctx.from.first_name;

  const welcomeString =
    `Hello, ${name} Welcome to the Chicago E-Skate Network.\n` +
    `Make sure to also join the main Chicago E-Skate Channel at: https://t.me/joinchat/NP_fsHcrXehkY2Qx\n` +
    `For info on the next group ride, click: /ride\n` +
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
