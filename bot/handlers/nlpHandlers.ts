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
    ],
  },
];

const nlp = async () => {
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

    // Add fallback intent

    await _nlp.train();
  }
  return _nlp;

  // const dock = await dockStart({ use: ['Basic'] });
};

const getNlpResponse = async (text: string): Promise<string> => {
  // const resp = await (await nlp()).process(text);
  const data = fs.readFileSync('./model.nlp', 'utf8');
  const manager = new NlpManager();
  manager.import(data);
  const resp = await manager.process(text);
  console.log(JSON.stringify(resp, null, 2));
  if (resp.intent != 'None' && resp.score > 0.95) {
    return resp.answer;
  }
  return '';
};

getNlpResponse('whens the next ride');

export default getNlpResponse;
