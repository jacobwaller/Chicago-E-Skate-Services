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

  ccwSection += leaderboard
    .map((item, idx) => {
      if (!item.ccw) return '';
      if (idx === 0) {
        return `🥇 ${item.name}: ${item.ccw}`;
      }
      if (idx === 1) {
        return `🥈 ${item.name}: ${item.ccw}`;
      }
      if (idx === 2) {
        return `🥉 ${item.name}: ${item.ccw}`;
      }
      return `${item.name}: ${item.ccw}`;
    })
    .join('\n');

  // for (let entry of leaderboard) {
  //   if (entry.ccw) {
  //     ccwSection += `${entry.name}: ${entry.ccw}\n`;
  //   }
  // }

  // create CW section
  let cwSection = 'CW:\n';
  leaderboard.sort((a: leaderboardEntry, b: leaderboardEntry) => {
    return a.cw - b.cw;
  });

  cwSection += leaderboard.map((item, idx) => {
    if (!item.cw) return '';
    if (idx === 0) {
      return `🥇 ${item.name}: ${item.cw}`;
    }
    if (idx === 1) {
      return `🥈 ${item.name}: ${item.cw}`;
    }
    if (idx === 2) {
      return `🥉 ${item.name}: ${item.cw}`;
    }
    return `${item.name}: ${item.cw}`;
  });

  // for (let entry of leaderboard) {
  //   if (entry.cw) {
  //     cwSection += `${entry.name}: ${entry.cw}\n`;
  //   }
  // }

  return await ctx.reply(ccwSection + '\n' + cwSection);
};
