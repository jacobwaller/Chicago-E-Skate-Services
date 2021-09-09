import axios from 'axios';
import { Context, NarrowedContext, Types } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
const { GIPHY_KEY } = process.env;

export const random = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['text']>,
) => {
  await ctx.replyWithChatAction('upload_photo');

  // Either the search text is provided or it defaults to skateboard
  const searchText =
    ctx.message.text.split(' ').slice(1).join(' ') || 'skateboard';

  const axiosResponse = await axios.get(
    `https://api.giphy.com/v1/gifs/random?api_key=${GIPHY_KEY}&tag=${searchText}&rating=R`,
  );

  if (axiosResponse.data.data?.images?.original?.mp4 == undefined) {
    return ctx.reply(`No results for query: ${searchText}`);
  }

  return ctx.replyWithAnimation(axiosResponse.data.data.images.original.mp4);
};
