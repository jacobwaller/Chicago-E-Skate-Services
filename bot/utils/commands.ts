import { Context } from 'telegraf';

const commands = {
  groupRide: ['ride', 'rides', 'grouprides', 'groupride'],
  random: ['random', 'random_gif', 'gif'],
};

type CommandResponse = {
  commands: Array<string>;
  response: string;
};

/**
 * Commands that are basic responses with no underlying logic are defined here
 */
const basicCommands: Array<CommandResponse> = [
  {
    commands: ['start'],
    response:
      'Thanks for adding me to this group. Use /help to learn what I can do',
  },
  {
    commands: ['help'],
    response:
      "Hello, I'm here to answer questions\n\n" +
      'You can give me commands like /ride /flashlight or /charge to get ' +
      'information on the next group ride, flashlight recommendations, or a link to our charging map',
  },
  {
    commands: ['flashlight', 'light', 'flashlights', 'lights'],
    response:
      "Check out the /r/flashlights post below to see some recommendations depending on what you're looking for\n" +
      'https://www.reddit.com/r/flashlight/comments/hermh9/arbitrary_list_of_popular_lights_summer_solstice/\n',
  },
  {
    commands: ['sendit', 'send_it'],
    response: 'https://gph.is/2AxB2hE',
  },
  {
    commands: ['battery', 'batteries'],
    response: 'https://www.youtube.com/watch?v=g-JsaT8N6rk',
  },
  {
    commands: ['pads', 'kneepads', 'elbowpads'],
    response:
      'TSG, G-Form, Revzilla' +
      'https://g-form.com/\n' +
      'https://www.revzilla.com\n',
  },
  {
    commands: ['charging', 'charge'],
    response:
      'https://www.google.com/maps/d/edit?mid=1KIzwP95pZD0A3CWmjC6lcMD29f4&usp=sharing',
  },
  {
    commands: ['links', 'link'],
    response:
      'Charging Map: https://www.google.com/maps/d/edit?mid=1KIzwP95pZD0A3CWmjC6lcMD29f4&usp=sharing\n' +
      'Boosted Board Riders Chicago: https://www.facebook.com/groups/BoostedCHI\n' +
      'Chicago E-Skate: https://www.facebook.com/groups/chicagoeskate/\n' +
      'Announcement Telegram: https://t.me/joinchat/AAAAAEwbHWf-hVIT53a75Q\n' +
      'Telegram Invite Link: https://t.me/joinchat/GtOvohDOaknaq_0JfboLJg\n',
  },
  {
    commands: ['helmet', 'helmets'],
    response:
      'Bern, Thousand, TSG, Ruroc.\n' +
      'Make sure any helmet you buy is certified. Most skate helmets are not certified.\n' +
      'http://www.bernunlimited.com/\n' +
      'https://www.explorethousand.com/\n' +
      'https://www.ruroc.com/en/\n' +
      'https://www.youtube.com/watch?v=b9yL5usLFgY',
  },
  {
    commands: ['nosedive'],
    response: 'ayy lmao\nhttps://www.youtube.com/watch?v=kc6IEVV9mp0',
  },
  {
    commands: ['milk', 'milked'],
    response: 'https://www.instagram.com/p/BwfUSWGhauy/',
  },
  {
    commands: ['rule', 'rules'],
    response:
      'For more information on the rules, visit: http://bit.ly/CHIesk8Rules\n\n' +
      '1. Wear a helmet.\n' +
      '2. Seriously, wear a helmet.\n' +
      '3. Keep a safe following distance.\n' +
      '4. Stagger yourselves while riding.\n' +
      '5. Wear clothing that wont fly off or get caught in wheels.\n' +
      "6. Don't blind people with your flashlight.\n" +
      '7. Watch where you shine your flashlight.\n' +
      '8. Ride within your limits.\n' +
      '9. Be a team player.\n' +
      '10. Communicate.\n' +
      '11. Come prepared.\n' +
      '12. Obey traffic signals.\n' +
      '13. Excersise caution.\n' +
      '14. Ride Defensively.\n' +
      '15. Avoide Road Rage.\n' +
      '16. Keep some form of emergency contact info on your person.\n' +
      '17. Do not ride drunk.\n' +
      '18. No spamming.\n' +
      '19. Be honest with transactions.',
  },
  {
    commands: ['strava'],
    response:
      'Track your miles and share your routes! Join Boosted Chicago on Strava by visiting:\nhttps://www.strava.com/clubs/boostedchi',
  },
  {
    commands: ['tire', 'tires'],
    response:
      'Onewheel Tire Information:\n' +
      'https://www.hoosiertire.com/\n' +
      'http://vegausa.com/\n' +
      'https://burrisracing.com/\n' +
      'https://www.dunloptires.com/\n' +
      'For tire upcycling, DM: @tire_sire',
  },
  {
    commands: [
      'dirttrack',
      'dirt_track',
      'track',
      'the_garden',
      'thegarden',
      'trackrules',
      'track_rules',
    ],
    response:
      'Counter Clockwise ONLY.\n' +
      'Up to three people riding together at a time.\n' +
      'Yield to bike riders.\n' +
      "No BBQ on the grounds. It's okay in the parking lot.\n" +
      'Take out what you bring in. Be responsible.\n' +
      'Patch up any divots you make in the track.\n',
  },
];

export { basicCommands, commands };
