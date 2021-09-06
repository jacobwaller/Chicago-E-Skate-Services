import { Context, NarrowedContext, Scenes, Types } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import {
  SceneContextScene,
  SceneSession,
  SceneSessionData,
  Stage,
} from 'telegraf/typings/scenes';
import { SessionContext } from 'telegraf/typings/session';
import { ChargeSpot } from '../utils/types';

const addChargeId = 'ADD_CHARGE_SCENE_ID';
const findChargeId = 'FIND_CHARGE_SCENE_ID';

interface ChargeContext extends Context {
  // will be available under `ctx.locationData`
  locationData: Partial<ChargeSpot>;
  // declare scene type
  scene: Scenes.SceneContextScene<ChargeContext, Scenes.WizardSessionData>;
  // declare wizard type
  wizard: Scenes.WizardContextWizard<ChargeContext>;
}

const addChargeScene = new Scenes.WizardScene(
  addChargeId,
  async (wizardCtx) => {
    const ctx = wizardCtx as ChargeContext;
    await ctx.reply(
      'Thank you for helping to add new charge locations! Please send the location of your charge spot.\n\n(Tap the paperclip in the bottom right, select location, then select "Send your current location")',
    );
    ctx.locationData.id = 'testId';
    return ctx.wizard.next();
  },
  async (wizardCtx) => {
    const ctx = wizardCtx as ChargeContext;
    await ctx.reply(ctx.locationData.id || 'undefined');
    ctx.wizard.next();
  },
);

export const charge = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['text']>,
  next: () => Promise<void>,
) => Stage.enter<ChargeContext>(addChargeId);
