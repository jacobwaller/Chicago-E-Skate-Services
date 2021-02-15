import { Context } from 'telegraf';

export default (ctx: Context) => {
  const name = ctx.message.from.first_name || ctx.message.from.username;
  let title = "Bot's DMs";
  if (ctx.message.sender_chat.type != 'private') {
    title = `- ${ctx.message.sender_chat.title}`;
  }

  const welcomeString =
    `Hey, ${name} Welcome to the Chicago E-Skate Network ${title}\n` +
    `For info on the next group ride, click: /group_ride\n` +
    `For more info on the group go to chicagoeskate.com\n` +
    `Also, make sure you look at the Group Ride Guidelines by clicking: /rules\n`;

  return ctx.reply(welcomeString);
};
