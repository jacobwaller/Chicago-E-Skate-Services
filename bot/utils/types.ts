import { isConditionalExpression } from 'typescript';

type ApiResponse = {
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

enum ChargeType {
  UNKNOWN,
  INDOOR,
  OUTDOOR,
}

type ChargeSpot = {
  id: string;
  userAdded: number; // userId of the person who added it (-1 if unknown)
  chargeType: ChargeType;
  lat: number;
  lon: number;
  title: string;
  description?: string;
};

type UserData = {
  id: string;
  firstname: string;
  lastname?: string;
  username?: string;
  warnings: Array<Warning>;
  additionalData: Array<{
    key: string;
    value: any;
  }>;
};

type Warning = {
  datetime: string;
  reason: string;
};

export { ApiResponse, UserData, Warning, ChargeSpot };
