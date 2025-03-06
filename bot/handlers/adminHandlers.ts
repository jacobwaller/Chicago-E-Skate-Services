import moment from 'moment-timezone';
import { Context, NarrowedContext, Types } from 'telegraf';
import { Update, User } from 'telegraf/typings/core/types/typegram';
import {
  getChargeSpots,
  getContestTime,
  getUserById,
  setContestTime,
  tgToDbUser,
  updateUser,
} from './dbHandlers';
import { GROUP_IDS, MAIN_GROUP_ID } from '../utils/ids';
import { UserData, Warning } from '../utils/types';
import { getGroupRide } from './rideHandlers';

export const isAdmin = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['text']>,
  userId: number,
  chatId: number,
): Promise<boolean> => {
  console.log(`testing if ${userId} is admin of ${chatId}`);
  const admins = await ctx.telegram.getChatAdministrators(chatId);
  const filtered = admins.filter((admin) => {
    return admin.user.id === userId;
  });
  console.log(
    `User is ${filtered.length !== 0 ? '' : 'not'} an admin of ${chatId}`,
  );

  console.log('returning ', filtered.length !== 0);
  return filtered.length !== 0;
};

export const isMainAdmin = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['text']>,
): Promise<boolean> => {
  return await isAdmin(ctx, ctx.from.id, MAIN_GROUP_ID);
};

export const adminCommandHelper = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['text']>,
) => {
  const senderId = ctx.from.id;

  if (!(await isAdmin(ctx, senderId, MAIN_GROUP_ID))) {
    console.log(`${senderId} is not an admin`);
    await ctx.reply('Only admins of Chicago PEV can use this command...');
    return false;
  } else {
    const isReply = !!ctx.message.reply_to_message;
    if (!isReply) {
      console.log(`Improperly used command`);
      await ctx.reply(
        "Reply to the message of the person you'd like to warn...",
      );

      return false;
    } else {
      return true;
    }
  }
};

export const startContest = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['text']>,
  next: () => Promise<void>,
) => {
  if (!(await isAdmin(ctx, ctx.from.id, MAIN_GROUP_ID))) {
    console.log('Someone who was not an admin tried to use the command warn');
    return await next();
  }

  const startTime = await setContestTime();
  await ctx.reply(`Starting contest at time ${startTime}...`);
  return await next();
};

export const endContestSayWinners = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['text']>,
  next: () => Promise<void>,
) => {
  if (!(await isAdmin(ctx, ctx.from.id, MAIN_GROUP_ID))) {
    console.log('Someone who was not an admin tried to use the command warn');
    return await next();
  }
  await ctx.reply('getting results...');
  const time = await getContestTime();

  // Get all spots added after a certain time
  const allSpots = await getChargeSpots();
  const filteredSpots = allSpots.filter(
    (spot) => spot.timeAdded && spot.timeAdded > time,
  );

  await ctx.reply(
    `There were ${filteredSpots.length} charging spots added during the competition`,
  );

  // Grab all the userIds and calculate how many things they found
  const includedUserIds: { [key: string]: number } = {};
  for (const spot of filteredSpots) {
    if (!includedUserIds[spot.userAdded]) {
      includedUserIds[`${spot.userAdded}`] = 1;
    } else {
      includedUserIds[`${spot.userAdded}`]++;
    }
  }

  console.log('Included User IDs table:', JSON.stringify(includedUserIds));

  const arrayOfPeopleScores: Array<{ id: string; score: number }> = Object.keys(
    includedUserIds,
  ).map((key) => {
    return {
      id: key,
      score: includedUserIds[key],
    };
  });

  console.log('arrayOfPeopleScores:', arrayOfPeopleScores);

  let usersPlusScores: Array<UserData & { score: number }> = [];
  // Map from ID & score to name & score
  for (const score of arrayOfPeopleScores) {
    const user = await getUserById(score.id);
    usersPlusScores.push({ ...user, score: includedUserIds[score.id] });
  }

  usersPlusScores = usersPlusScores.sort((a, b) => b.score - a.score);

  const winnersString = usersPlusScores
    .map((user) => {
      const name = `${user.firstname} ${
        user.lastname || user.username || user.id
      } has ${user.score} points`;
      return name;
    })
    .join('\n');

  await ctx.reply(winnersString);

  return await next();
};

// // Adds a warning to the replied to member
// // Automatically bans them if they have 3 or more warnings
// // Use: /warn {reason}
// // ex: /warn rule 1 ( no helmet )
// export const warn = async (
//   ctx: NarrowedContext<Context<Update>, Types.MountMap['text']>,
//   next: () => Promise<void>,
// ) => {
//   if (!(await adminCommandHelper(ctx))) {
//     console.log('Someone who was not an admin tried to use the command warn');
//     return await next();
//   }

//   // Create warning
//   const reason = ctx.message.text.split(' ').slice(1).join(' ');

//   if (reason.trim() === '') {
//     return await ctx.reply("Must supply a reason '/warn {reason}");
//   }
//   const warning: Warning = {
//     datetime: moment(moment.now())
//       .tz('America/Chicago')
//       .format('MMM Do yyyy @ h:mm a'),
//     reason: reason,
//   };

//   // See if user exists in db
//   const replyMsg = ctx.message.reply_to_message;
//   const repliedUser = replyMsg?.from;
//   let user = await getUserById(`${repliedUser?.id}`);
//   // If not, create it
//   if (!user) {
//     user = tgToDbUser(repliedUser as User);
//   }
//   // Regardless, add a warning and update the user
//   user.warnings.push(warning);
//   await updateUser(user);

//   // If they have too many warnings, ban them
//   if (user.warnings.length >= 3) {
//     // ctx.kickChatMember(repliedUser?.id || 0);
//     await ctx.telegram.kickChatMember(MAIN_GROUP_ID, repliedUser?.id || 0);
//     await ctx.telegram.sendMessage(
//       MAIN_GROUP_ID,
//       `${user.firstname} is now banned for reason ${reason}`,
//     );
//     for (let id of GROUP_IDS) {
//       await ctx.telegram.kickChatMember(id, repliedUser?.id || 0);
//       await ctx.telegram.sendMessage(
//         id,
//         `${user.firstname} is now banned for reason ${reason}`,
//       );
//       // Add a little wait to avoid rate limiting
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//     }
//     return await next();
//   }

//   return await ctx.reply(`User now has ${user.warnings.length} warnings`);
// };

// // Removes the most recent warning to the replied to member
// export const unwarn = async (
//   ctx: NarrowedContext<Context<Update>, Types.MountMap['text']>,
//   next: () => Promise<void>,
// ) => {
//   if (!adminCommandHelper(ctx)) return await next();

//   // See if user exists in db
//   const replyMsg = ctx.message.reply_to_message;
//   const repliedUser = replyMsg?.from;
//   let user = await getUserById(`${repliedUser?.id}`);
//   // If not, create it
//   if (!user) {
//     user = tgToDbUser(repliedUser as User);
//   } else {
//     // if so, pop a warning
//     user.warnings.pop();
//   }

//   await updateUser(user);

//   return await ctx.reply(`User has ${user.warnings.length} warnings`);
// };

// // Gets a list of warnings
// export const warnings = async (
//   ctx: NarrowedContext<Context<Update>, Types.MountMap['text']>,
//   next: () => Promise<void>,
// ) => {
//   if (!adminCommandHelper(ctx)) return await next();

//   // See if user exists in db
//   const replyMsg = ctx.message.reply_to_message;
//   const repliedUser = replyMsg?.from;
//   let user = await getUserById(`${repliedUser?.id}`);
//   // If not, create it
//   if (!user) {
//     user = tgToDbUser(repliedUser as User);
//   }
//   await updateUser(user);

//   const warningsList = user.warnings.map(
//     (warning) => `User was warned on ${warning.datetime} for ${warning.reason}`,
//   );

//   const response =
//     warningsList.length === 0
//       ? 'User has no warnings'
//       : warningsList.join('\n');

//   return await ctx.reply(response);
// };

// Bans the replied to user
export const ban = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['text']>,
  next: () => Promise<void>,
) => {
  if (!(await adminCommandHelper(ctx))) return await next();

  const replyMsg = ctx.message.reply_to_message;
  const repliedUser = replyMsg?.from;
  if (repliedUser === undefined) {
    await ctx.reply('Reply to the person you want to ban');
    return await next();
  }
  await ctx.reply(`banned ${repliedUser.first_name}`);
  return await ctx.banChatMember(repliedUser.id);
};

// // TODO: Shh
// export const shh = async (
//   ctx: NarrowedContext<Context<Update>, Types.MountMap['text']>,
//   next: () => Promise<void>,
// ) => {
//   if (!adminCommandHelper(ctx)) return await next();
// };

export const shout = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['text']>,
  next: () => Promise<void>,
) => {
  // Check if sender is admin of main chat
  const senderId = ctx.from.id;
  if (!(await isAdmin(ctx, senderId, MAIN_GROUP_ID))) {
    return await ctx.reply(
      'Only admins of Chicago Eskate can use this command...',
    );
  }

  const messageText = ctx.message.text.split(' ').slice(1).join(' ');
  await ctx.telegram.sendMessage(MAIN_GROUP_ID, messageText);
  // Send message to every group
  for (let i = 0; i < GROUP_IDS.length; i++) {
    await ctx.telegram.sendMessage(GROUP_IDS[i], messageText);

    // Add a little wait to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return await next();
};

export const announce = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['text']>,
  next: () => Promise<void>,
) => {
  // Check if sender is admin of main chat
  const senderId = ctx.from.id;
  if (!(await isAdmin(ctx, senderId, MAIN_GROUP_ID))) {
    return await ctx.reply(
      'Only admins of Chicago PEV can use this command...',
    );
  }

  // Send group ride info to chicago PEV
  const groupRideString = await getGroupRide(0);
  const msg = await ctx.telegram.sendMessage(MAIN_GROUP_ID, groupRideString);
  // Post poll to Chicago PEV
  const poll = await ctx.telegram.sendPoll(
    MAIN_GROUP_ID,
    'Will you make it to this group ride?',
    [
      'Yes - eBike', 
      'Yes - eSk8',
      'Yes - eMoto',
      'Yes - EUC', 
      'Yes - eScooter',
      'Yes - Something else',
      'Maybe...',
      "Next time",
    ],
    {
      is_anonymous: false,
    },
  );
  // Forward poll and group ride to every group
  for (let i = 0; i < GROUP_IDS.length; i++) {
    await ctx.telegram.forwardMessage(
      GROUP_IDS[i],
      MAIN_GROUP_ID,
      msg.message_id,
    );
    await ctx.telegram.forwardMessage(
      GROUP_IDS[i],
      MAIN_GROUP_ID,
      poll.message_id,
    );

    // Add a little wait to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return await next();
};
