import { Firestore } from '@google-cloud/firestore';
import { Base64 } from 'js-base64';
import { User } from 'telegraf/typings/core/types/typegram';
import { ChargeSpot, UserData } from '../utils/types';

require('dotenv').config();

let _db: Firestore;

const db = () => {
  if (_db === undefined) {
    const tokenInfo = Base64.decode(process.env.FIRESTORE_TOKEN || '');
    const tokenObject = JSON.parse(tokenInfo);
    const clientEmail = tokenObject.client_email;
    const privateKey = tokenObject.private_key;

    _db = new Firestore({
      projectId: process.env.PROJECT_ID,
      ignoreUndefinedProperties: true,
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    });
  }
  return _db;
};

export const addChargeSpot = async (spot: ChargeSpot) => {
  return await db().collection('charge').doc(spot.id).set(spot);
};

export const getChargeSpots = async () => {
  const dat = await db().collection('charge').get();
  const ret: Array<ChargeSpot> = [];
  dat.forEach((item) => {
    ret.push(item.data() as ChargeSpot);
  });
  return ret;
};

export const deleteChargeSpot = async (id: string) => {
  return await db().collection('charge').doc(id).delete();
};

export const tgToDbUser = (tgUser: User): UserData => {
  return {
    id: `${tgUser.id}`,
    firstname: tgUser.first_name,
    lastname: tgUser.last_name,
    username: tgUser.username,
    warnings: [],
    additionalData: [],
    conversationalStep: undefined,
    locationOptOut: false,
  };
};

/**
 *
 * @param userId The ID of the user
 * @returns The UserData
 */
export const getUserById = async (userId: string) => {
  const userRef = db().collection('users').doc(userId);
  return (await userRef.get()).data() as UserData;
};

/**
 *
 * @param user The UserData to either add or update the entry with
 */
export const updateUser = async (user: UserData) => {
  return await db().collection('users').doc(user.id).set(user);
};

export const setContestTime = async (): Promise<number> => {
  const time = new Date().getTime();
  await db().collection('time').doc('time').set({ time: new Date().getTime() });
  return time;
};

export const getContestTime = async () => {
  const timeRef = db().collection('time').doc('time');
  return ((await timeRef.get()).data() as { time: number }).time;
};

export const createLocationEntry = async (
  latitude: number,
  longitude: number,
  time: string,
) => {
  await db().collection('locations').add({
    latitude,
    longitude,
    time,
  });
};
