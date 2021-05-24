import { Telegraf } from 'telegraf';
import { HttpFunction } from '@google-cloud/functions-framework/build/src/functions';

import { basicCommands, commands } from './utils/commands';

import groupRide from './utils/groupRide';
import randomGif from './utils/randomGif';
// import { encode, decode } from 'js-base64';

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
  // TODO: Verify admin-ship of EBike & Escooter to be able to just set this to length
  for (let i = 0; i < 2; i++) {
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
    `[Chicago E\\-Bike](https://t.me/joinchat/Wf2XjBZ07edmYjBh/)\n`;

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

bot.command(
  ['shutup', 'shh', 'thatsenough', 'thatsenoughfornow'],
  async (ctx, next) => {
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

    // Check if we're replying to a message
    if (ctx.message.reply_to_message === undefined) {
      return await ctx.reply('You must reply to a message to use this command');
    }

    // Get the user ID of the person we're trying to mute
    const muteId = ctx.message.reply_to_message.from?.id;
    if (muteId === undefined) {
      return await ctx.reply('Something went wrong');
    }

    // Determine Unix time, 12 hours in the future. Mute until then
    const time = new Date().setMinutes(new Date().getMinutes() + 5);

    await bot.telegram.restrictChatMember(mainId, muteId, {
      permissions: {
        can_send_messages: false,
      },
      until_date: time.valueOf(),
    });

    const name = ctx.message.reply_to_message.from?.first_name;

    return await ctx.reply(
      `Hi ${name}. You have been muted for 12 hours. Or until :${time.toLocaleString(
        'US',
      )} UTC. You can check out our rules by DMing me /rules. Further violations of these rules may result in your removal from the group. Thanks.`,
    );
  },
);

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

// Commented out for a future feature
// bot.command(['add-location', 'add'], async (ctx) => {
//   if (ctx.message.chat.type !== 'private') {
//     return await ctx.reply(
//       `Sorry! I cannot add charging locations in group chats. Please DM me to add a new charging location. Click: @${bot.botInfo?.username}`,
//     );
//   }
//   const split = ctx.message.text.split(' ');
//   // Error checking for dummies
//   if (split.length < 2 || !ctx.message.text.includes('*')) {
//     return await ctx.reply(
//       "Must supply title and description in format /add <title> * <description>. Remember, do not include a '*' in your title or description ",
//     );
//   } else if (
//     ctx.message.text.indexOf('*') !== ctx.message.text.lastIndexOf('*')
//   ) {
//     return await ctx.reply(
//       'Please do not include a * in your title or decription',
//     );
//   }
//   const splIndex = split.indexOf('*');

//   const title = split.slice(1, splIndex).join(' '); // combine all the strings back together from after /add until the '*'
//   const description = split.slice(splIndex + 1).join(' '); // Combine all the strings after '*' to make the description
//   if (title.trim() === '') {
//     return await ctx.reply('Must supply a title');
//   } else if (description.trim() === '') {
//     return await ctx.reply('Must supply a description');
//   }

//   const str = JSON.stringify({
//     title: title,
//     description: description,
//   });
//   const b64 = encode(str);
//   return await ctx.reply(
//     `Awesome! Go ahead and reply to this message with the location of the charging spot. \n\n${b64}`,
//   );
// });

// bot.on('location', async (ctx) => {
//   // Needs to be replying to me
//   if (
//     ctx.message.chat.type === 'private' && // Needs to be DMing me
//     ctx.message.reply_to_message !== undefined && // Replying to something
//     ctx.message.reply_to_message.from !== undefined && // Replying to someone
//     ctx.message.reply_to_message.from.id === bot.botInfo?.id && // Replying to me
//     'text' in ctx.message.reply_to_message // Make ts happy. If we're at this point, it's definitely a text message
//   ) {
//     // Check if we're adding location
//     const split = ctx.message.reply_to_message.text.split('\n\n');
//     if (split.length === 2) {
//       const objSoFar = JSON.parse(decode(split[1]));
//       const lat = ctx.message.location.latitude;
//       const lon = ctx.message.location.longitude;
//       objSoFar.lat = lat;
//       objSoFar.lon = lon;
//       // Make API Request. Instead, just post it
//       return await ctx.reply(JSON.stringify(objSoFar, undefined, 2));
//     }

//     // Check if we're requesting locations
//   } else {
//     // not replying to me, need to handle anyway
//     return;
//   }
// });

bot.command(commands.groupRide, async (ctx) => ctx.reply(await groupRide()));
bot.command(commands.random, async (ctx) => await randomGif(ctx));

bot.on('new_chat_members', async (ctx) => {
  let name = ctx.from.first_name;

  const inviteLink = bot.telegram.exportChatInviteLink(mainId);

  const welcomeString =
    `Hello, ${name} Welcome to the Chicago E-Skate Network.\n` +
    `Make sure to also join the main Chicago E-Skate Channel [here](${inviteLink}).\n` +
    `For info on the next group ride, click: /ride\n` +
    `For more info on the group, check out our [website](https://chicagoeskate.com)\n` +
    `Also, make sure you look at the Group Ride Guidelines by clicking: /rules\n`;

  return await ctx.reply(welcomeString, { parse_mode: 'MarkdownV2' });
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
