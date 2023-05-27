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
    return a.ccw - b.ccw;
  });

  let place = 1;
  for (let entry of leaderboard) {
    if (entry.ccw) {
      switch (place) {
        case 1:
          ccwSection += '🥇 ';
          break;
        case 2:
          ccwSection += '🥈 ';
          break;
        case 3:
          ccwSection += '🥉 ';
          break;
        default:
          ccwSection += `${place}. `;
      }
      ccwSection += `${entry.name}: ${entry.ccw}\n`;
      place++;
    }
  }

  // create CW section
  let cwSection = 'CW:\n';
  leaderboard.sort((a: leaderboardEntry, b: leaderboardEntry) => {
    return a.cw - b.cw;
  });

  place = 1;
  for (let entry of leaderboard) {
    if (entry.cw) {
      switch (place) {
        case 1:
          cwSection += '🥇 ';
          break;
        case 2:
          cwSection += '🥈 ';
          break;
        case 3:
          cwSection += '🥉 ';
          break;
        default:
          cwSection += `${place}. `;
      }
      cwSection += `${entry.name}: ${entry.cw}\n`;
      place++;
    }
  }

  return await ctx.reply(ccwSection + '\n' + cwSection);
};
