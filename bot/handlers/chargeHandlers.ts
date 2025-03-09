import { v4 } from 'uuid';
import { Context, Markup, NarrowedContext, Scenes, Types } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import {
  addChargeSpot,
  deleteChargeSpot,
  getChargeSpots,
  getUserById,
  tgToDbUser,
  updateUser,
} from './dbHandlers';
import {
  ChargeSpot,
  ChargeSteps,
  ChargeType,
  ConversationCategory,
  UserData,
} from '../utils/types';
import { cancelKeyboard, yesNoKeyboard } from './conversationHandler';
import { adminCommandHelper, isAdmin, isMainAdmin } from './adminHandlers';
import { MAIN_GROUP_ID } from '../utils/ids';

export const charge = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['message']>,
  next: () => Promise<void>,
) => {
  if (ctx.chat.type !== 'private') {
    return await ctx.reply(
      `This needs to be done in DMs to prevent spam. Please DM me the same command by clicking this: @${ctx.botInfo.username}`,
    );
  }

  const userId = `${ctx.from.id}`;
  let user = await getUserById(userId);
  if (user === undefined) {
    user = tgToDbUser(ctx.from);
  }
  user.conversationalStep = {
    category: ConversationCategory.GET_CHARGE,
    stepInfo: ChargeSteps.Location,
    state: {},
  };
  await updateUser(user);

  return await ctx.reply(
    'Please send me your current location.',
    cancelKeyboard,
  );
};

export const deleteCharge = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['text']>,
  next: () => Promise<void>,
) => {
  if (!(await isMainAdmin(ctx))) {
    return await ctx.reply('Only admins can do this.');
  }

  const id = ctx.message.text.split(' ')[1];
  if (!id) {
    return await ctx.reply('Please provide an ID.');
  }
  const spotDeleted = await deleteChargeSpot(id);

  if (spotDeleted) {
    return await ctx.reply('Charge spot deleted.');
  }
  return await ctx.reply('Charge spot not found or error occurred.');
};

export const add = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['message']>,
  next: () => Promise<void>,
) => {
  if (ctx.chat.type !== 'private') {
    return await ctx.reply(
      `This needs to be done in DMs to prevent spam. Please DM me the same command by clicking this: @${ctx.botInfo.username}`,
    );
  }

  const userId = `${ctx.from.id}`;
  let user = await getUserById(userId);
  if (user === undefined) {
    user = tgToDbUser(ctx.from);
  }
  user.conversationalStep = {
    category: ConversationCategory.ADD_CHARGE,
    stepInfo: ChargeSteps.Location,
    state: {},
  };
  await updateUser(user);

  return await ctx.reply(
    "Thank you for helping to add to the charge map! Please send the location of the charge spot.\n\n(Click the paperclip in the bottom right, click location, click Send My Location or move the pin to where you'd like)",
    cancelKeyboard,
  );
};

export const getCharge = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['message']>,
  next: () => Promise<void>,
  user: UserData,
) => {
  if (!user.conversationalStep || !user.conversationalStep.state) {
    return await ctx.reply('Something went wrong.');
  }
  const step = user.conversationalStep.stepInfo;
  if (step === ChargeSteps.Location) {
    if (!('location' in ctx.message)) {
      user.conversationalStep = undefined;
      await updateUser(user);
      return await ctx.reply(
        "I'm waiting for your current location. Send /charge to try again",
      );
    }
    const lat = ctx.message.location.latitude;
    const lon = ctx.message.location.longitude;
    const spots = await getChargeSpots();

    // Sort them by distance to our target location
    const subset = spots
      .sort((a, b) => {
        const aToSearch = Math.pow(
          Math.pow(a.lat - lat, 2) + Math.pow(a.lon - lon, 2),
          0.5,
        );
        const bToSearch = Math.pow(
          Math.pow(b.lat - lat, 2) + Math.pow(b.lon - lon, 2),
          0.5,
        );

        return aToSearch - bToSearch;
      })
      .slice(0, 3);

    for (const spot of subset) {
      await ctx.replyWithLocation(spot.lat, spot.lon);
      const loc =
        spot.chargeType === ChargeType.UNKNOWN
          ? ''
          : `The above location is ${spot.chargeType}s.\n\n`;
      const msg = `${loc}Description:\n${spot.description}\n\nid: ${spot.id}`;
      await ctx.reply(msg);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    user.conversationalStep = undefined;
    await updateUser(user);
    return await ctx.reply(
      "If any of these charging locations don't work or if there is a problem, DM the info message to @jacob_waller.\nIf none of these charging locations help you, check out our charging map at: map.jacobwaller.org",
    );
  }
};

export const addCharge = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['message']>,
  next: () => Promise<void>,
  user: UserData,
) => {
  if (!user.conversationalStep || !user.conversationalStep.state) {
    return await ctx.reply('Something went wrong.');
  }
  const step = user.conversationalStep.stepInfo;

  if (step === ChargeSteps.Location) {
    if (!('location' in ctx.message)) {
      user.conversationalStep = undefined;
      await updateUser(user);
      return await ctx.reply(
        "I'm waiting for a location of a charge spot. To try again, send /add",
      );
    }

    user.conversationalStep.state.lat = ctx.message.location.latitude;
    user.conversationalStep.state.lon = ctx.message.location.longitude;
    user.conversationalStep.stepInfo = ChargeSteps.Type;
    await updateUser(user);

    return await ctx.reply(
      'Thanks! Is this charge location indoors?',
      yesNoKeyboard,
    );
  }
  // if (step === ChargeSteps.Type) {
  //   if (!('text' in ctx.message)) {
  //     user.conversationalStep = undefined;
  //     await updateUser(user);
  //     return await ctx.reply(
  //       "I'm waiting for a 'yes' or a 'no' if the charge location is indoors or not. To try again, send /add",
  //     );
  //   }

  //   const msg = ctx.message.text.toLowerCase();
  //   const indoors = msg.includes('yes');

  //   user.conversationalStep.state.indoors = indoors
  //     ? ChargeType.INDOOR
  //     : ChargeType.OUTDOOR;
  //   user.conversationalStep.stepInfo = ChargeSteps.Description;
  //   await updateUser(user);

  //   return await ctx.reply(
  //     `Sweet. I've got that as ${
  //       indoors ? 'indoors' : 'outdoors'
  //     }. Last step, send a quick description of where this location is. For example, is it inside a business? on a light pole? etc`,
  //   );
  // }
  if (step === ChargeSteps.Description) {
    if (!('text' in ctx.message)) {
      user.conversationalStep = undefined;
      await updateUser(user);
      return await ctx.reply(
        "I'm waiting for a description of the charge location. To try again, send /add",
      );
    }

    user.conversationalStep.state.description = ctx.message.text;

    const data: ChargeSpot = {
      id: v4(),
      chargeType: user.conversationalStep.state.indoors,
      lat: user.conversationalStep.state.lat,
      lon: user.conversationalStep.state.lon,
      description: user.conversationalStep.state.description,
      userAdded: ctx.from.id,
      timeAdded: new Date().getTime(),
    };

    // Allow people to test and make sure they understand it
    if (data.description?.toLowerCase() !== 'fake') await addChargeSpot(data);

    user.conversationalStep = undefined;
    await updateUser(user);

    return await ctx.reply(
      'Thanks! Your charge location has been added to the database',
    );
  }

  return await ctx.reply('Something went wrong.');
};
