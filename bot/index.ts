import { Telegraf } from 'telegraf';
import { HttpFunction } from '@google-cloud/functions-framework/build/src/functions';

import { basicCommands, commands } from './utils/commands';

import groupRide from './utils/groupRide';
import randomGif from './utils/randomGif';
import escapeChars from './utils/escapeChars';

const { BOT_TOKEN, PROJECT_ID, FUNCTION_NAME, REGION } = process.env;
const bot = new Telegraf(BOT_TOKEN || '');
const IS_PROD = FUNCTION_NAME?.includes('QA') ? false : true;
const mainId = IS_PROD ? -1001365176902 : -1001218570823; // ESkate
const groupIds = IS_PROD
  ? [
      -1001315765753, // Onewheel
      -1001270121090, // EUC
      -1001456184875, // EBike
      -475206987, // EScooter
    ]
  : [];

/*
Command - Description to send to Bot Father
ride - get the next group ride
random - get a random gif
discounts - get discount codes
help - view the help page
flashlight - get flashlight recommendations
battery - get a link to our preffered battery maker
pads - get pad recommendations
charge - get the map for charging locations
group - get links to the different facebook and telegram groups
helmet - get helmet recommendations
rules - read these
strava - get a link to our strava
tires - onewheel tire recommendations
track - rules for The Garden
sendit - gif
milk - FM pls sponsor me
nosedive - lmaoooo
*/

// Supposedly only ever needs to be called once. Uncomment and deploy if changing anything
// bot.telegram.setWebhook(
//   `https://${REGION}-${PROJECT_ID}.cloudfunctions.net/${FUNCTION_NAME}`,
// );

basicCommands.forEach((item) => {
  bot.command(
    item.commands,
    async (ctx) =>
      await ctx.reply(item.response, { parse_mode: item.parse_mode }),
  );
});

bot.command(['groups', 'group', 'Groups', 'Group'], async (ctx) => {
  const eskateInvite = await bot.telegram.exportChatInviteLink(mainId);
  const restInvites = [];

  for (let i = 0; i < 3; i++) {
    const id = groupIds[i];
    const link = await bot.telegram.exportChatInviteLink(id);
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
});

bot.command('shout', async (ctx, next) => {
  // Check if sender is admin of main chat
  const senderId = ctx.from.id;
  const admins = await bot.telegram.getChatAdministrators(mainId);

  const filtered = admins.filter((admin) => {
    return admin.user.id === senderId;
  });

  if (filtered.length === 0) {
    return await ctx.reply(
      'Only admins of Chicago Eskate can use this command...',
    );
  }

  const messageText = ctx.message.text.split(' ').slice(1).join(' ');
  await bot.telegram.sendMessage(mainId, messageText);
  // Send message to every group
  for (let i = 0; i < groupIds.length; i++) {
    await bot.telegram.sendMessage(groupIds[i], messageText);

    // Add a little wait to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return await next();
});

bot.command('announce', async (ctx, next) => {
  // Check if sender is admin of main chat
  const senderId = ctx.from.id;
  const admins = await bot.telegram.getChatAdministrators(mainId);

  const filtered = admins.filter((admin) => {
    return admin.user.id === senderId;
  });

  if (filtered.length === 0) {
    return await ctx.reply(
      'Only admins of Chicago Eskate can use this command...',
    );
  }

  // Send group ride info to chicago Eskate
  const groupRideString = await groupRide();
  const msg = await bot.telegram.sendMessage(mainId, groupRideString);
  // Post poll to Chicago Eskate
  const poll = await bot.telegram.sendPoll(
    mainId,
    'Will you make it to this group ride?',
    ['Hell yeah', 'Maybe (Watch the posted live location)', 'Next time...'],
    {
      is_anonymous: false,
    },
  );
  // Forward poll and group ride to every group
  for (let i = 0; i < groupIds.length; i++) {
    await bot.telegram.forwardMessage(groupIds[i], mainId, msg.message_id);
    await bot.telegram.forwardMessage(groupIds[i], mainId, poll.message_id);

    // Add a little wait to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return await next();
});

bot.command(commands.groupRide, async (ctx) => ctx.reply(await groupRide()));
bot.command(commands.random, async (ctx) => await randomGif(ctx));

bot.on('new_chat_members', async (ctx) => {
  let name = ctx.from.first_name;

  const inviteLink = bot.telegram.exportChatInviteLink(mainId);

  const welcomeString =
    `Hello, ${escapeChars(name)} Welcome to the Chicago E\\-Skate Network\\.\n` +
    `Make sure to also join the main Chicago E\\-Skate Channel [here](${inviteLink}).\n` +
    `For info on the next group ride, click: /ride\n` +
    `For more info on the group, check out our [website](https://chicagoeskate.com)\n` +
    `Also, make sure you look at the Group Ride Guidelines by clicking: /rules\n`;

  return await ctx.reply(welcomeString, { parse_mode: 'MarkdownV2' });
});

bot.on('message', async (ctx, next) => {
  if (ctx.chat.type === 'private') {
    return await next();
  }

  const updateGroupId = ctx.chat.id;
  const inGroup =
    groupIds.filter((id) => updateGroupId === id).length >= 1 ||
    updateGroupId === mainId;

  if (!inGroup) {
    await ctx.telegram.leaveChat(updateGroupId);
  }
  return await next();
});

bot.on('pinned_message', async (ctx, next) => {
  return await next();
});

export const botFunction: HttpFunction = async (req, res) => {
  console.log(req.body);
  try {
    // Handle the update
    await bot.handleUpdate(req.body);
    console.log('Success');
    res.status(200).send('Success');
  } catch (err) {
    console.error(err);
    res.status(200).send('Issue with Telegram API');
  }
};
