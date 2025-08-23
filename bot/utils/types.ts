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
  ADD_CHARGE = 'CHARGE',
  GET_CHARGE = 'GET_CHARGE',
}

export enum ChargeType {
  UNKNOWN = 'unknown',
  INDOOR = 'indoor',
  OUTDOOR = 'outdoor',
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
  timeAdded: number; // Unix Epoch Time in ms
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
  banned?: boolean;
  locationOptOut?: boolean;
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
