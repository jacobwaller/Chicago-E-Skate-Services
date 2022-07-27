import { Context, NarrowedContext, Types } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { createLocationEntry, getUserById, updateUser } from './dbHandlers';

export const optOut = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['text']>,
  next: () => Promise<void>,
) => {
  const userId = ctx.update.message.from.id;
  const userData = await getUserById(`${userId}`);
  userData.locationOptOut = true;
  await updateUser(userData);
  await ctx.reply('You have opted out of location sharing');
  return await next();
};

export const optIn = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['text']>,
  next: () => Promise<void>,
) => {
  const userId = ctx.update.message.from.id;
  const userData = await getUserById(`${userId}`);
  userData.locationOptOut = false;
  await updateUser(userData);
  await ctx.reply('You have opted in to location sharing');
  return await next();
};

export const locationHandler = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['location']>,
  next: () => Promise<void>,
) => {
  // first determine if user has opted out of location sharing
  const userId = ctx.from.id;
  const user = await getUserById(`${userId}`);
  if (user.locationOptOut) {
    return await next();
  }

  const lat = ctx.message.location.latitude;
  const lon = ctx.message.location.longitude;
  const time = new Date().toISOString();

  await createLocationEntry(lat, lon, time);

  return await next();
};
