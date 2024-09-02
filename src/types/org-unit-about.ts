export interface getOrgUnitAboutResponse {
  enrollments: { events: IEvent[] }[];
}

export interface IEvent {
  event: string;
  dataValues: DataValue[];
}

export interface DataValue {
  dataElement: string;
  value: string;
}

export interface GroupActivities {
  code: string;
  name: string;
  directIndirect: string;
  sex: string;
  age: string;
}

export interface Session {
  code: string;
  sessions: string[];
}
