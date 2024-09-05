import axiosInstance from './base-api';
import {
  getOrgUnitAboutResponse,
  GroupActivities,
  Session,
} from '../types/org-unit-about';

export async function getOrgUnitAbout(id: string) {
  const response = await axiosInstance.get<getOrgUnitAboutResponse>(
    // `${process.env.REACT_APP_BASE_URL}/ovc/api/trackedEntityInstances/${id}.json?program=IXxHJADVCkb&fields=enrollments[events[event,dataValues[dataElement,value]]`
    `/ovc/api/trackedEntityInstances/${id}.json?program=IXxHJADVCkb&fields=enrollments[events[event,dataValues[dataElement,value]]` //wth proxy
  );

  const sessions: Session[] = [];
  const groupActivities: GroupActivities[] = [];

  response.data.enrollments.forEach((enrollment) => {
    enrollment.events.forEach((event) => {
      if (event.dataValues.length === 5) {
        groupActivities.push({
          name: event.dataValues[0].value,
          code: event.dataValues[1].value,
          directIndirect: event.dataValues[2].value,
          age: event.dataValues[3].value,
          sex: event.dataValues[4].value,
        });
      }
      if (event.dataValues.length === 3) {
        sessions.push({
          code: event.dataValues[0].value,
          sessions: [event.dataValues[1].value, event.dataValues[2].value],
        });
      }
    });
  });

  const groupedSessions: Session[] = [];

  sessions.forEach((session) => {
    const existingSession = groupedSessions.find(
      (s) => s.code === session.code
    );
    if (existingSession) {
      existingSession.sessions.push(...session.sessions);
    } else {
      groupedSessions.push(session);
    }
  });

  return { sessions, groupActivities };
}
