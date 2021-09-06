import { isConditionalExpression } from 'typescript';

export type ApiResponse = {
  title: string;
  date: string;
  meetTime: string;
  launchTime: string;
  group: string;
  startPoint: string;
  endPoint: string;
  type: string;
  routeLink: string;
  routeDistance: string;
  description: string;
};

export enum ConversationCategory {
  CHARGE = 'CHARGE',
}

export enum ChargeType {
  UNKNOWN,
  INDOOR,
  OUTDOOR,
}

export enum ChargeSteps {
  Type = 'WAIT_FOR_INSIDE',
  Location = 'WAIT_FOR_LOCATION',
  Description = 'WAIT_FOR_DESCRIPTION',
}

export type ChargeSpot = {
  id: string;
  userAdded: number; // userId of the person who added it (-1 if unknown)
  chargeType: ChargeType;
  lat: number;
  lon: number;
  title: string;
  description?: string;
};

export type ConversationInfo = {
  category: ConversationCategory;
  stepInfo: string;
  state?: any;
};

export type UserData = {
  id: string;
  firstname: string;
  lastname?: string;
  username?: string;
  warnings: Array<Warning>;
  conversationalStep?: ConversationInfo;
  additionalData: Array<{
    key: string;
    value: any;
  }>;
};

export type Warning = {
  datetime: string;
  reason: string;
};
