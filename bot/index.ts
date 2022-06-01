import { Telegraf } from 'telegraf';
import { basicCommands, commands } from './utils/commands';
import escapeChars from './utils/escapeChars';
import { getUserById, tgToDbUser, updateUser } from './handlers/dbHandlers';
import conversationHandler, {
  endConversation,
  noCallback,
  yesCallback,
} from './handlers/conversationHandler';
import {
  announce,
  ban,
  endContestSayWinners,
  shh,
  shout,
  startContest,
  unwarn,
  warn,
  warnings,
} from './handlers/adminHandlers';
import { GROUP_IDS, MAIN_GROUP_ID } from './utils/ids';
import { add, charge } from './handlers/chargeHandlers';
import { group } from './handlers/groupHandlers';
import { nextCallback, prevCallback, ride } from './handlers/rideHandlers';
import { random } from './handlers/externalHandlers';
import { HttpFunction } from '@google-cloud/functions-framework';
import getNlpResponse from './handlers/nlpHandlers';

const { BOT_TOKEN, PROJECT_ID, FUNCTION_NAME, REGION } = process.env;
const bot = new Telegraf(BOT_TOKEN || '');

/*
Command - Description to send to Bot Father
ride - get the next group ride
random - get a random gif
discounts - get discount codes
help - view the help page
flashlight - get flashlight recommendations
battery - get a link to our preffered battery maker
pads - get pad recommendations
charge - get charging locations near you
add - add a charging location
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

// Things to process first
bot.on('message', async (ctx, next) => {
  // Add everyone who sends a message to the DB
  const userId = `${ctx.from.id}`;
  let user = await getUserById(userId);

  if (user === undefined) {
    user = tgToDbUser(ctx.from);
    await updateUser(user);
  }

  if ('text' in ctx.message && ctx.message.text.startsWith('/')) {
    if (user.warnings.length >= 3) {
      const warningText = user.warnings
        .map((warning) => warning.reason)
        .join('\n');

      return await ctx.reply(
        `Sorry, unfortunately you have warnings for:\n${warningText}\n\nWhat does this mean? You cannot use commands anymore until the warnings go away. Contact an admin of Chicago ESkate if you have any questions. Any more warnings will have you banned from all Chicago PEV Groups.`,
      );
    }
  }
  return await next();
});

basicCommands.forEach((item) => {
  bot.command(item.commands, async (ctx, next) => {
    await ctx.reply(item.response, { parse_mode: item.parse_mode });
    return await next();
  });
});

// Admin commands
bot.command('warn', warn);
bot.command('unwarn', unwarn);
bot.command('warnings', warnings);
bot.command('ban', ban);
bot.command('shh', shh);
bot.command('shout', shout);
bot.command('announce', announce);
bot.command('start_contest', startContest);
bot.command('end_contest', endContestSayWinners);

// Charging commands
bot.command('charge', charge);
bot.command('add', add);

// Button Handlers
bot.action('🛑 Cancel', endConversation);
bot.action('✅ Yes', yesCallback);
bot.action('❎ No', noCallback);
bot.action('⏮️', prevCallback);
bot.action('⏭️', nextCallback);

// Group commands
bot.command(['groups', 'group', 'Groups', 'Group'], group);
bot.command(commands.groupRide, ride);

// Misc
bot.command(commands.random, random);

bot.on('new_chat_members', async (ctx) => {
  const nameOrNames = ctx.message.new_chat_members
    .map((member) => member.first_name)
    .join(', ');

  const inviteLink = await bot.telegram.exportChatInviteLink(MAIN_GROUP_ID);

  const welcomeString =
    `Hello, ${escapeChars(
      nameOrNames,
    )} Welcome to the Chicago E\\-Skate\\+ Network\\.\n` +
    `Make sure to also join the main Chicago E\\-Skate\\+ Channel [here](${inviteLink})\\.\n` +
    `For info on the next group ride, click: /ride\n` +
    `For more info on the group, check out our [website](https://chicagoeskate.com)\n` +
    `Also, make sure you look at the Group Ride Guidelines by clicking: /rules\n`;

  return await ctx.reply(welcomeString, { parse_mode: 'MarkdownV2' });
});

// Things to process after everything else
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
    const groups = [MAIN_GROUP_ID, ...GROUP_IDS];
    if (groups.filter((id) => id === ctx.chat.id).length === 0) {
      return await ctx.reply(
        `PLEASE REMOVE ME FROM THIS GROUP. If you'd like me in this group, please DM @jacob_waller and be sure to include this number: ${ctx.chat.id}`,
      );
    }
  }
  return await next();
});

bot.on('text', async (ctx, next) => {
  // Don't process commands
  if (!ctx.message.text.startsWith('/')) {
    const resp = await getNlpResponse(ctx.message.text);

    if (resp !== '') {
      await ctx.reply(resp);
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
