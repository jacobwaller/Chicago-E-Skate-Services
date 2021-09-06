import { Context, NarrowedContext, Telegraf, Types } from 'telegraf';
import { HttpFunction } from '@google-cloud/functions-framework/build/src/functions';

import { basicCommands, commands } from './utils/commands';

import groupRide from './utils/groupRide';
import randomGif from './utils/randomGif';
import escapeChars from './utils/escapeChars';
import isAdmin from './utils/isAdmin';
import { Message, Update, User } from 'telegraf/typings/core/types/typegram';
import { getUserById, tgToDbUser, updateUser } from './utils/dbHandler';
import { ChargeSteps, ConversationCategory, Warning } from './utils/types';
import moment from 'moment-timezone';
import { charge } from './handlers/chargeHandler';
import conversationHandler from './handlers/conversationHandler';

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

const adminCommandHelper = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['text']>,
) => {
  const senderId = ctx.from.id;
  if (!isAdmin(senderId, mainId, bot)) {
    await ctx.reply('Only admins of Chicago Eskate can use this command...');
    return false;
  }

  const isReply = !!ctx.message.reply_to_message;
  if (!isReply) {
    await ctx.reply("Reply to the message of the person you'd like to warn...");
    return false;
  }
  return true;
};

// Adds a warning to the replied to member
// Use: /warn {reason}
// ex: /warn rule 1 ( no helmet )
bot.command('warn', async (ctx, next) => {
  if (!adminCommandHelper(ctx)) return await next();

  // Create warning
  const reason = ctx.message.text.split(' ').slice(1).join(' ');

  if (reason.trim() === '') {
    return await ctx.reply("Must supply a reason '/warn {reason}");
  }
  const warning: Warning = {
    datetime: moment(moment.now())
      .tz('America/Chicago')
      .format('MMM Do yyyy @ h:mm a'),
    reason: reason,
  };

  // See if user exists in db
  const replyMsg = ctx.message.reply_to_message;
  const repliedUser = replyMsg?.from;
  let user = await getUserById(`${repliedUser?.id}`);
  // If not, create it
  if (!user) {
    user = tgToDbUser(repliedUser as User);
  }
  // Regardless, add a warning and update the user
  user.warnings.push(warning);
  await updateUser(user);

  return await ctx.reply(`User now has ${user.warnings.length} warnings`);
});

// Removes the most recent warning to the replied to member
bot.command('unwarn', async (ctx, next) => {
  if (!adminCommandHelper(ctx)) return await next();

  // See if user exists in db
  const replyMsg = ctx.message.reply_to_message;
  const repliedUser = replyMsg?.from;
  let user = await getUserById(`${repliedUser?.id}`);
  // If not, create it
  if (!user) {
    user = tgToDbUser(repliedUser as User);
  } else {
    // if so, pop a warning
    user.warnings.pop();
  }

  await updateUser(user);

  return await ctx.reply(`User has ${user.warnings.length} warnings`);
});

// Lists warnings to the replied to message
bot.command('warnings', async (ctx, next) => {
  if (!adminCommandHelper(ctx)) return await next();

  // See if user exists in db
  const replyMsg = ctx.message.reply_to_message;
  const repliedUser = replyMsg?.from;
  let user = await getUserById(`${repliedUser?.id}`);
  // If not, create it
  if (!user) {
    user = tgToDbUser(repliedUser as User);
  }
  await updateUser(user);

  const warningsList = user.warnings.map(
    (warning) => `User was warned on ${warning.datetime} for ${warning.reason}`,
  );

  const response =
    warningsList.length === 0
      ? 'User has no warnings'
      : warningsList.join('\n');

  return await ctx.reply(response);
});

// Bans the replied to member
bot.command('ban', async (ctx, next) => {
  if (!adminCommandHelper(ctx)) return await next();

  const replyMsg = ctx.message.reply_to_message;
  const repliedUser = replyMsg?.from;
  if (repliedUser === undefined) {
    return await next();
  }

  return await ctx.kickChatMember(repliedUser?.id);
});

bot.on('location', (ctx) => {
  ctx.message.location;
});

bot.command(['shh', 'silence', 'mute'], async (ctx, next) => {
  if (!adminCommandHelper(ctx)) return await next();
});

bot.command('add', async (ctx, next) => {
  if (ctx.chat.type !== 'private') {
    return await ctx.reply(
      'This needs to be done in DMs to prevent spam. Please click DM me the command /charge',
    );
  }

  const userId = `${ctx.from.id}`;
  let user = await getUserById(userId);
  if (user === undefined) {
    user = tgToDbUser(ctx.from);
  }
  user.conversationalStep = {
    category: ConversationCategory.CHARGE,
    stepInfo: ChargeSteps.Location,
    state: {},
  };
  await updateUser(user);

  return await ctx.reply(
    'Thank you for helping to add to the charge map! Please send the location of the charge location.\n\n(Click the paperclip in the bottom right, click location, click Send My Location)',
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
  if (!isAdmin(senderId, mainId, bot)) {
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
  if (!isAdmin(senderId, mainId, bot)) {
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

bot.command(commands.groupRide, async (ctx) => {
  await ctx.replyWithChatAction('typing');
  return await ctx.reply(await groupRide());
});
bot.command(commands.random, async (ctx) => {
  await ctx.replyWithChatAction('upload_photo');
  return await randomGif(ctx);
});

bot.on('new_chat_members', async (ctx) => {
  let name = ctx.from.first_name;

  const inviteLink = bot.telegram.exportChatInviteLink(mainId);

  const welcomeString =
    `Hello, ${escapeChars(
      name,
    )} Welcome to the Chicago E\\-Skate Network\\.\n` +
    `Make sure to also join the main Chicago E\\-Skate Channel [here](${inviteLink})\\.\n` +
    `For info on the next group ride, click: /ride\n` +
    `For more info on the group, check out our [website](https://chicagoeskate.com)\n` +
    `Also, make sure you look at the Group Ride Guidelines by clicking: /rules\n`;

  return await ctx.reply(welcomeString, { parse_mode: 'MarkdownV2' });
});

// This has to be the last thing we do
bot.on('message', async (ctx, next) => {
  if (ctx.chat.type === 'private') {
    // We're in a DM, handle conversations
    // grab the potential user / or add them to DB
    const userId = `${ctx.from.id}`;
    let user = await getUserById(userId);
    if (user === undefined) {
      user = tgToDbUser(ctx.from);
      await updateUser(tgToDbUser(ctx.from));
    }

    return await conversationHandler(ctx, next, user);
  } else {
    // If this is from a group we don't know about, spam them
    const groups = [mainId, ...groupIds];
    if (groups.filter((id) => id === ctx.chat.id).length === 0) {
      return await ctx.reply(
        `PLEASE REMOVE ME FROM THIS GROUP. If you'd like me in this group, please DM @jacob_waller and be sure to include this number: ${ctx.chat.id}`,
      );
    }
  }
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
