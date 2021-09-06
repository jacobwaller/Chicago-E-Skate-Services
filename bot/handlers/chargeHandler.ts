import { Context, NarrowedContext, Scenes, Types } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';

export const handleAddCharge = async () => {};
export const handleGetCharge = async () => {};

export const charge = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['text']>,
  next: () => Promise<void>,
) => {};
