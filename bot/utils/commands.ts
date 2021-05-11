import { Context } from 'telegraf';

const commands = {
  groupRide: ['ride', 'rides', 'grouprides', 'groupride', 'group_ride'],
  random: ['random', 'random_gif', 'gif'],
};

type CommandResponse = {
  commands: Array<string>;
  response: string;
};

const l = (name: string, url: string): string => {
  return `[${name}](${url})`;
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
    commands: ['discount', 'discounts', 'codes', 'code'],
    response: `
Brand	Code	Discount
ORORO	CHICAGOONEWHEEL	25% OFF
FLIPSKY	FLIP-NYC	10% OFF
SHREDLIGHTS	EBOARDBRANDON	10% OFF
TSG via Zeitbike.com	NYCEB25	25% OFF
FLATLAND3D	SHARETHEROAD	10% OFF
THOUSAND HELMETS	BOOSTED15	15% OFF
BOA WHEELS	NYCROCKS	10% OFF
HOYT ST	JOEESKATE	FREE SHIRT+SUNGLASSES WITH BOARD PURCHASE
REVEL	https://www.revelboards.com/?ref=RObJTi6Y16mHf3	$25 OFF KIT PURCHASE
EBOARDSTUFF	YEAH15	15% OFF
ROMP	YEAH-15	15% OFF
SPLATTERGOAT GRIP	YEAH10	10% OFF
NOBLEMAN	YEAH5	5% OFF
MONDAY MOTORBIKES	MONDAYEVE2020	$300 OFF
EVOLVE	EBOARDBRANDON50	$50 OFF
SUPER73	https://www.talkable.com/x/OVmh7E	$100 OFF
CRAFT&RIDE	CHICAGOOW	FREE SHIPPING
CHIBATTERYSYSTEMS	CHICAGOESK8	$25 OFF
EOVAN	DAMES	5% OFF
JAY&TRENT ONLYFANS	SKATE312	20% OFF   
    `,
  },
  {
    commands: ['help'],
    response:
      'I am here to help answer questions about Chicago E-Skate.\n' +
      'Find out when the next group ride is with the command /ride\n' +
      'To request that your group ride or event is available with that command, DM @jacob_waller\n' +
      "for a list of commands that I have available, type a '/' and select the command you'd like",
  },
  {
    commands: ['flashlight', 'light', 'flashlights', 'lights'],
    response:
      "Check out the /r/flashlights post below to see some recommendations depending on what you're looking for\n" +
      '[Reddit List](https://www.reddit.com/r/flashlight/comments/hermh9/arbitrary_list_of_popular_lights_summer_solstice),',
  },
  {
    commands: ['sendit', 'send_it'],
    response: 'https://gph.is/2AxB2hE',
  },
  {
    commands: ['battery', 'batteries'],
    response: `For custom batteries, check out [ChibatterySystems](https://chibatterysystems.com/)`,
  },
  {
    commands: ['pads', 'kneepads', 'elbowpads'],
    response:
      'TSG, G-Form, Revzilla' +
      '[GForm](https://g-form.com/)\n' +
      '[Revzilla](https://www.revzilla.com)\n',
  },
  {
    commands: ['charging', 'charge'],
    response:
      '[Here](https://www.google.com/maps/d/edit?mid=1KIzwP95pZD0A3CWmjC6lcMD29f4&usp=sharing) is the charging map.',
  },
  {
    commands: ['groups', 'group', 'Groups', 'Group'],
    response:
      'Facebook Groups:\n' +
      '[Chicago E-Skate](https://www.facebook.com/groups/chicagoeskate/)\n' +
      '[Chicago E-Bike](https://www.facebook.com/groups/665412891024870/)\n' +
      '[Chicago Electric Scooters](https://www.facebook.com/groups/301631767538431/)\n' +
      '[Chicago EUC](https://www.facebook.com/groups/chicagoeuc/)\n' +
      '[Chicago Onewheel](facebook.com/groups/chicagoonewheel/)\n' +
      '\n' +
      'Telegram Groups:\n' +
      '[Chicago E-Skate](https://t.me/joinchat/UV7yRo0dvO3hNhpi/)\n' +
      '[Chicago E-Bike](https://t.me/joinchat/Wf2XjBZ07edmYjBh/)\n' +
      '[Chicago EUC](https://t.me/joinchat/KVjiJBwwz5YOwDJvBxX5ww/)\n' +
      '[Chicago Onewheel](https://t.me/joinchat/Tmz9-bhYM7-ygtri/)\n',
  },
  {
    commands: ['helmet', 'helmets'],
    response:
      'Bern, Thousand, TSG, Ruroc.\n' +
      'Make sure any helmet you buy is certified. Most skate helmets are not certified.\n' +
      '[Bern](http://www.bernunlimited.com/)\n' +
      '[Zeitbike](https://www.zeitbike.com/collections/helmets/)\n' +
      '[Thousand](https://www.explorethousand.com/)\n' +
      '[Ruroc](https://www.ruroc.com/en/)\n\n' +
      '[I LOVE HELMETS](https://www.youtube.com/watch?v=b9yL5usLFgY)',
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
      'For more information on the rules, visit [here](http://bit.ly/CHIesk8Rules)\n\n' +
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
      '15. Avoid Road Rage.\n' +
      '16. Keep some form of emergency contact info on your person.\n' +
      '17. Do not ride drunk.\n' +
      '18. No spamming.\n' +
      '19. Be honest with transactions.',
  },
  {
    commands: ['strava'],
    response:
      'Track your miles and share your routes! [Join Chicago Eskate on Strava](https://www.strava.com/clubs/chicagoeskate)\n',
  },
  {
    commands: ['tire', 'tires'],
    response:
      'Onewheel Tire Information:\n' +
      '[Hoosier](https://www.hoosiertire.com/)\n' +
      '[Vega](http://vegausa.com/)\n' +
      '[Burris Racing](https://burrisracing.com/)\n' +
      '[Dunlop](https://www.dunloptires.com/)\n' +
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
