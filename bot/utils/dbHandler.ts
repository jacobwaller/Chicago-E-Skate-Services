import { Firestore } from '@google-cloud/firestore';
import { Base64 } from 'js-base64';
import { User } from 'telegraf/typings/core/types/typegram';
import { UserData } from './types';

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
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    });
  }
  return _db;
};

const tgToDbUser = (tgUser: User): UserData => {
  return {
    id: `${tgUser.id}`,
    firstname: tgUser.first_name,
    lastname: tgUser.last_name,
    username: tgUser.username,
    warnings: [],
    additionalData: [],
  };
};

/**
 *
 * @param userId The ID of the user
 * @returns The UserData
 */
const getUserById = async (userId: string) => {
  const userRef = db().collection('users').doc(userId);
  return (await userRef.get()).data() as UserData;
};

/**
 *
 * @param user The UserData to either add or update the entry with
 */
const updateUser = async (user: UserData) => {
  return await db().collection('users').doc(user.id).set(user);
};

export { getUserById, updateUser, tgToDbUser };
