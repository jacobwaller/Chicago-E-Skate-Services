// @ts-ignore
import { dockStart } from '@nlpjs/basic';
const fs = require('fs');
const { NlpManager } = require('node-nlp');

let _nlp: any = undefined;

type IntentResponse = {
  intent: string;
  response: string;
  utterances: string[];
};

const trainingData: IntentResponse[] = [
  {
    intent: 'request.ride',
    response:
      "If you're asking for the next group ride, use the command /ride. Or check out our website at chicagoeskate.com",
    utterances: [
      'When is the next group ride?',
      'When is the next ride?',
      'Anyone know when the next group ride is?',
      'where does the ride start',
      'where does the group ride start',
    ],
  },
  {
    intent: 'request.map',
    response:
      "If you're asking for the charging map, use the command /map. You can also click the link for it here: map.chicagoeskate.com",
    utterances: [
      'Where is a charging spot',
      'where is the charging map',
      'my battery is dead',
      'charge map',
      'give me the map',
      'give me the charge map',
      'can i get a charge map',
      'where is the charge map',
      'looking for the charge map',
    ],
  },
  {
    intent: 'None',
    response: '',
    utterances: [
      'ill meet you guys at the ride',
      'im going to be late to the ride',
      'im going to be a little late to the ride',
      'just use google maps to navigate there',
      'throw up your live location',
      'who plans the group rides',
      'how often do you guys ride?',
      'my name is jacob',
      `Yesterday's Night Ride was legit AF
      Thank you to everyone who came out & rode into the windy cold night
      First 18 mile leg was fire...as long as everyone has the range, we'll continue to try & stretch out the riding to the first stop.
      Special thank you to our sponsor, ChiBatterySystems!  Go check them out for all your charging/battery needs.  DM me for a discount if you're interested in any products!
      Sorry for the lack of media, I'll get a better handlebar cell phone/camera setup for the next ride.
      See everybody Tuesday!`,
      'The inaugural @chibatterysystems Saturday EBike Group Ride was a success!',
      'Crushed 30+ miles from Devon to 43rd street & everything in between',
      'Thank you to everyone who braved the harsh wind & cold to rip it up!',
      "Intro To Speed was a nice stop as well.  Check them out of you're into tracking your ride.",
      'Special thank you to CBS for sponsoring the ride.  Please see them for any ebike charger & battery upgrades you might need!',
      "We'll have another Saturday EBike Group Ride on the 30th, until then please go check out the Tuesday Night Ride series",
      "Lincoln Park's aliveOne Celebrating 25 Years With Month-Long Series Of Free Concerts, Fundraiser For Ukraine",
      'Block Club Chicago',
      "Lincoln Park's aliveOne Celebrating 25 Years With Month-Long Series Of Free Conc...",
      'The live music-focused bar opened in 1996 and has hosted musicians who went on to play for Buddy Guy, Neal Francis and other big names.',
      'Ayyy this is awesome. Big news for them I hope it drives a lot of business',
      "Agreed...glad they're getting some shine",
      'Thanks, great info.',
      'Yes adhesive is attached however the nature of the vehicle we use them on tire changes and  the like makes it advantageous to use Velcro cut to size this way you can easily apply and reapply the strips as needed. This was figured out after changing flats and swapping out tires and having to reapply the 3M adhesive.',
      'BTF-LIGHTING WS2812B RGB 5050SMD... https://www.amazon.com/dp/B01CDTE6Y6?ref=ppx_pop_mob_ap_share',
      "For veteran Sherman two of these are required, and they fit perfectly, a controller will be needed I like to utilize a Bluetooth programmable one ,I'll link below",
      'Any water issues with IP65?  Any recommended controller?',
      'Lol, thanks',
      'ALITOVE WS2812B Controller Bluetooth Music Sync WS2811 Addressable RGB LED Controller with RF Remote Dual Signal Output DC 5V~24V for SK6812 WS2812 SM16703 1903 3Pin Dream Color LED Pixel Strip Lights https://www.amazon.com/dp/B089Q4TW3J/ref=cm_sw_r_apan_i_PC9ZGTW1N2YJGD8RPSDX?_encoding=UTF8&psc=1',
      'No Water issues whatsoever and I actually ride in the winter rain snow',
      'thanks!',
      "idk how you guys do it it feels like I'm leaning forward sooo much then I look at euc world afterwards and I've never gone faster than 35",
      'Practice. And a little stupidity! 😎',
      'Definitely',
      'It works on sound too.',
      "Great!  Which LED's are these?  Link?",
      'Did you use the USB port or are you using a power bank?',
      "I'm using the usb but I bought 2 power banks when I thought I was buying one. I didn't know where to mount it. The Velcro on it was not strong enough the hold (I think). I wonder if it's damaging anything like the battery.",
      "Which led's are these?  How many per foot?",
      'Amazon,  6ft strip is perfect',
      'Found it. Can you dim them?  I am looking at the specs right now.',
      'They look great!',
      "No you can't dim them.",
      'Stefano Rossi Limited-time deal: Govee RGBIC TV LED Backlight, LED Lights for TV with APP Control, Music Sync, Scene Modes, 6.56FT RGBIC Color Changing Strip Lights for 30-50 inch TVs, USB Powered ',
      'Planning an Impromptu Group Ride for this Saturday in Chicago — does that still count as impromptu then? 🫠',
      "If you're interested, please comment on the post with what you'd be in the mood for and what time! I'll start with the brainstorming",
      "Earth Day themed ride. Pick up trash, then get trashed at Irish Eyes pub. It's on my block. I have 6 trash picker-uppers, garbage bags, hand sanitizer, disposable gloves, and chargers.",
      'It is. Almost got blew off a few times.',
      'Is riding against the wind the equivalent of riding up a hill? 🤷🏽‍♂️',
      'technically yes?',
      'same as riding with the wind is like riding down a hill',
      'Has anyone put a knobby on a 16x',
      'Pretty much',
      "He's over torquing his legs 😂",
      'But it is a nice alternating stance 😁',
      'Very cool',
      'Good idea.',
      "Idk how I'd like it in front of me. Might be distracting",
      'Yeah, better to have it behind you so you have to turn your head around 180 degrees to see the info that you want.',
      "The Sherman screen is already in the perfect spot. Itss there when you need it and doesn't obstruct your vision",
      'This would better',
      'Is that for real?  Who makes it?',
      "Yes it is it's an actual phone too you can put a SIM card into it",
      'You talking about the ticwris or the projection on the ground?',
      "I'm curious about the projection.",
      'Sorry I was talking about ticwris that projection is just an accident waiting to happen',
      'Lol',
      'What is all this talk of distraction? It seems to me the issue is that some people have not yet matured enough to focus on a task at hand. Sink or swim people!',
      'Id put it eveb further in front',
      'Like 10 feet',
      'Any of you guys try the nylonove foot plates?',
      'Is there a list of good trails out there somewhere?',
      'National Trail Map for Biking, Walking, Hiking | TrailLink',
      'Explore trails around the country with our national trail map to find trail descriptions, reviews, photos, and maps on TrailLink.com.',
      'Hello, Daniel Welcome to the Chicago E-Skate+ Network.',
      'Make sure to also join the main Chicago E-Skate+ Channel here.',
      'For info on the next group ride, click: /ride',
      'For more info on the group, check out our website',
      'Also, make sure you look at the Group Ride Guidelines by clicking: /rules',
      'The best hands down. I have them on my Sherman and RS',
      'when',
      'where',
      'how',
      'It attempts to get an intent from every text message that is sent. If it matches the ride or map intent, it sends the appropriate message',
      'Saturday confirmed, before the first ride starts',
      'Whats the plan tomorrow? Where we meeting and when?',
      'Meet where, when?  I can head out in an hour.',
      'You can check the charging map',
      'Lake Front Trail is the place to start.  Ride it downtown to Buckingham Fountain, Museum campus',
      'I dont think right side passing is inherently wrong. Close passes are wrong, and should be mDe on the left or right, not wothout a warning. Given 6 feet of space, I make both left or right side passes The closest i will pass someone is just beyond arms lenght. If im close enough to touch someone, I do not pass',
      'FOLLOW THE MAP MY SON 😂😂😂',
      'Youll get more efficient as you get more practice and sweat less... most likely.  Everyone is different.  You probably sweat a lot less more than when you first started.',
    ],
  },
];

/**
 * Used to locally train the model before deploying
 * @returns
 */
export const train = async () => {
  if (!_nlp) {
    const dock = await dockStart({ use: ['Basic'] });

    _nlp = dock.get('nlp');
    _nlp.addLanguage('en');

    trainingData.forEach((data) => {
      // Add utterances
      data.utterances.forEach((utterance) => {
        _nlp.addDocument('en', utterance, data.intent);
      });

      // Add Response
      _nlp.addAnswer('en', data.intent, data.response);
    });

    await _nlp.train();
  }
  return _nlp;
};

const getNlpResponse = async (text: string): Promise<string> => {
  // const resp = await (await nlp()).process(text);
  const data = fs.readFileSync('./model.nlp', 'utf8');
  const manager = new NlpManager();
  manager.import(data);
  const resp = await manager.process(text);
  console.log(resp);

  if (resp.intent !== 'None' && resp.score > 0.95) {
    const scrPercentage = Math.floor(resp.score * 100);

    return `${resp.answer}\n\nConfidence: ${scrPercentage}%. DM Jacob Waller if this didn't work properly.`;
  }
  return '';
};

const a = async () => {
  await train();
  console.log(await getNlpResponse('hello'));
};

// a();

export default getNlpResponse;
