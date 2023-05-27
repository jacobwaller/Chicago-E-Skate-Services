import axios from 'axios';
import { Context, NarrowedContext, Types } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';

type leaderboardEntry = {
  name: string;
  ccw: number;
  cw: number;
};

export const leaderboardHandler = async (
  ctx: NarrowedContext<Context<Update>, Types.MountMap['text']>,
) => {
  console.log('leaderboardHandler');
  const axiosResponse = await axios.get<leaderboardEntry[]>(
    `${process.env.API_URL}/leaderboard`,
  );
  const leaderboard = axiosResponse.data;
  console.log(leaderboard);
  if (Object.keys(leaderboard).length === 0) {
    return await ctx.reply('No leaderboard found');
  }

  // create CCW section
  let ccwSection = 'CCW:\n';
  leaderboard.sort((a: leaderboardEntry, b: leaderboardEntry) => {
    return b.ccw - a.ccw;
  });

  for (let entry of leaderboard) {
    if (entry.ccw) {
      ccwSection += `${entry.name}: ${entry.ccw}\n`;
    }
  }

  // create CW section
  let cwSection = 'CW:\n';
  leaderboard.sort((a: leaderboardEntry, b: leaderboardEntry) => {
    return b.cw - a.cw;
  });

  for (let entry of leaderboard) {
    if (entry.cw) {
      cwSection += `${entry.name}: ${entry.cw}\n`;
    }
  }

  return await ctx.reply(ccwSection + '\n' + cwSection);
};
