const Telegraf = require("telegraf");
const request = require("request");

require("dotenv").config();
const {
  BOT_TOKEN,
  NODE_ENV,
  PROJECT_ID,
  FUNCTION_NAME,
  SECRET_COMMAND,
} = process.env;

const REGION = "us-central1";
const bot = new Telegraf(BOT_TOKEN);

//Generic Command Section. Commands defined in basicCommands.json
const { commands } = require("./basicCommands");
for (var i = 0; i < commands.length; i++) {
  bot.command(commands[i].commands, Telegraf.reply(commands[i].response));
}

var group_ride_comms = ["group_ride", "groupride", "ride", "rides"];
bot.command(group_ride_comms, (ctx) => {
  request(
    `https://us-central1-chicagoeskatewebsite-293020.cloudfunctions.net/fetchRide?id=0`,
    { json: true },
    (err, res, body) => {
      if (err) {
        ctx.reply("Error fetching group rides");
      } else {
        let response;
        if (body == {}) {
          response = "There are no group rides planned :(";
        } else {
          response =
            `${body.title} (${body.group}):\n` +
            `Date: ${body.date}\n` +
            `Meet At: ${body.meetTime}\n` +
            `Depart At: ${body.launchTime}\n` +
            `From: ${body.startPoint}\n` +
            `To: ${body.endPoint}\n` +
            `Route: ${body.routeLink} (${body.routeDistance} Miles)\n\n` +
            `${body.description}\n\n` +
            `The ride will be conducted on ${body.type} conditions, so make sure your vehicle can handle that terrain.\n\n` +
            `Arrive to the start point with enough charge to follow the route.\n\n` +
            `DON'T FORGET YOUR HELMET!`;
        }
        ctx.reply(response);
      }
    }
  );
});

// Fetches a random gif and posts it. Can optionally be used with a keyword. Will defualt
// to a random gif with keyword 'skateboard' if none is given
bot.command("random", (ctx) => {
  let input = ctx.message.text; // the whole command
  // ex. "/random car"
  let term = "skateboard";

  if (input.split(" ").length > 1) {
    // Check if a keyword was added, if so, replace term
    term = input.split(" ")[1];
  }

  request(
    `https://api.giphy.com/v1/gifs/random?api_key=${GIPHY_KEY}&tag=${term}&rating=R`,
    { json: true },
    (err, res, body) => {
      if (err) {
        ctx.reply("error fetching random gif");
      } //Uh oh spaghettio
      else {
        ctx.replyWithAnimation(body.data.images.downsized_large.url);
      } // Send message with gif
    }
  );
});

// Command for making the bot say random things
bot.command(SECRET_COMMAND, (ctx) => {
  ctx.reply(ctx.message.text.toString().substring(6));
  ctx.telegram.sendMessage(GROUP_ID, ctx.message.text.toString().substring(6));
});

bot.help((ctx) =>
  ctx.reply(
    "Hi! I'm here to answer some questions.\n\n" +
      "/helmets: Get a list of links to some pretty good helmets\n" +
      "/links: Get a list of helpful links for newcomers or those who are curious\n" +
      "/group_ride: Gives information on the next group ride\n" +
      "/charge: Gives the charging map for Chicago\n" +
      "/nosedive: idk some OneWheel meme\n" +
      "/sendit: inspiration\n" +
      "/bearings: shows a gif on how to remove bearings from a wheel\n" +
      "/battery: shows a video on how to replace the battery on a Boosted Board\n" +
      "Version: 3.0"
  )
);

//Runs whenever someone new joins the channel
bot.on("new_chat_members", (ctx) => {
  ctx.reply(
    "Hey! Welcome to the Chicago E-Skate Network.\n" +
      "For a map on places to charge, check out: https://www.google.com/maps/d/edit?mid=1KIzwP95pZD0A3CWmjC6lcMD29f4&usp=sharing\n" +
      "For info on the next group ride, click: /group_ride\n" +
      "If you want to know more about what I can do, click /help\n" +
      "For even more info, check out: chicagoeskate.com/\n" +
      "Also, make sure you look at the Group Ride Guidelines by clicking: /rules"
  );
});

// This should be the last thing we check for.
// Used to make sure we don't timeout
bot.on("message", (ctx) => undefined);
if (NODE_ENV === "production") {
  bot.telegram.setWebhook(
    `https://${REGION}-${PROJECT_ID}.cloudfunctions.net/${FUNCTION_NAME}`
  );
  exports.botFunction = (req, res) => {
    bot.handleUpdate(req.body, res);
  };
} else {
  bot.launch();
}
