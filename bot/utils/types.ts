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

export { ApiResponse, UserData, Warning };
