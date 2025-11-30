import { Context } from 'telegraf';

const commands = {
  groupRide: ['ride', 'rides', 'grouprides', 'groupride', 'group_ride'],
  random: ['random', 'random_gif', 'gif'],
};

type CommandResponse = {
  commands: Array<string>;
  response: string;
  parse_mode?: 'MarkdownV2';
};

const l = (name: string, url: string): string => {
  return `[${name}](${url})`;
};
const parse_mode = 'MarkdownV2';

/**
 * Commands that are basic responses with no underlying logic are defined here
 */
const basicCommands: Array<CommandResponse> = [
  {
    commands: ['discount', 'discounts', 'codes', 'code'],
    response:
      'Check out all discounts available to Chicago PEV members [here](https://docs.google.com/spreadsheets/d/1QTMuWO8k5719MeBt535rA_kPvSEVmiTI3wVA9Bcwu5g/edit?usp=sharing)',
    parse_mode,
  },
  {
    commands: ['sponsor', 'sponsors', 'donate'],
    response: 'https://github.com/sponsors/jacobwaller',
  },
  {
    commands: ['map', 'chargemap', 'charge_map'],
    response: 'New Map Here: map.jacobwaller.org\n\nOld Map Here: map.chicagoeskate.com',
  },
  {
    commands: ['help'],
    response:
      'I am here to help answer questions about Chicago PEV.\n' +
      'Find out when the next group ride is with the command /ride\n' +
      "for a list of commands that I have available, type a '/' and select the command you'd like",
  },
  {
    commands: ['flashlight', 'light', 'flashlights', 'lights'],
    response:
      "Check out the /r/flashlights post below to see some recommendations depending on what you're looking for\n" +
      '[Reddit List](https://www.reddit.com/r/flashlight/comments/hermh9/arbitrary_list_of_popular_lights_summer_solstice),',
    parse_mode,
  },
  {
    commands: ['sendit', 'send_it'],
    response: 'https://gph.is/2AxB2hE',
  },
  {
    commands: ['battery', 'batteries'],
    response: `For custom batteries, check out [ChiBatterySystems](https://chibatterysystems.com/)`,
    parse_mode,
  },
  {
    commands: ['pads', 'kneepads', 'elbowpads'],
    response:
      'TSG, G\\-Form, Revzilla\n\n' +
      '[GForm](https://g-form.com/)\n' +
      '[Revzilla](https://www.revzilla.com)\n',
    parse_mode,
  },
  {
    commands: ['helmet', 'helmets'],
    response:
      '[I LOVE HELMETS](https://www.youtube.com/watch?v=b9yL5usLFgY)\n\n' +
      'Bern, Thousand, TSG, Ruroc\\.\n' +
      'Make sure any helmet you buy is certified\\. Most skate helmets are not certified\\.\n\n' +
      '[Bern](http://www.bernunlimited.com/)\n' +
      '[Zeitbike](https://www.zeitbike.com/collections/helmets/)\n' +
      '[Thousand](https://www.explorethousand.com/)\n' +
      '[Ruroc](https://www.ruroc.com/en/)\n\n',
    parse_mode,
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
      'For further details on the rules, visit http://bit.ly/CHIesk8Rules\n\n' +
      'All rides are 18+\n\n' +
      '1. Wear a helmet.\n' +
      '2. Seriously, wear a F** helmet\n' +
      '3. Keep a safe following distance (one car length of space for every 10mph)\n' +
      '4. Turn off ALL lights before pulling up to or entering a business\n' +
      '5. Ride within your limits & be cognizant of your surroundings\n' +
      '6. Be a team player\n' +
      '7. Communicate. Join Discord for live voice chat during the rides and watch our live location on Telegram if you get lost\n' +
      '8. Come charged & prepared\n' +
      '9. No Road Rage\n' +
      '10. Keep some form of emergency contact info on your person\n' +
      '11. Do not ride overly intoxicated\n' +
      '12. No spamming\n' +
      '14. Be honest with transactions\n' +
      '15. Do NOT share crash videos of someone without their consent\n\n' +
      '16. Must follow city/state ordinances regarding COVID-19 mitigation.\n' +
      'DM Management or ask questions related to rules in the Chicago PEV Telegram Chat',
  },
  {
    commands: ['strava'],
    response:
      'Track your miles and share your routes\\! [Join Chicago PEV on Strava](https://www.strava.com/clubs/chicagopev)\n',
    parse_mode,
  },
  {
    commands: ['tire', 'tires'],
    response:
      'Onewheel Tire Information:\n' +
      '[Hoosier](https://www.hoosiertire.com/)\n' +
      '[Vega](http://vegausa.com/)\n' +
      '[Burris Racing](https://burrisracing.com/)\n' +
      '[Dunlop](https://www.dunloptires.com/)',
    parse_mode,
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
