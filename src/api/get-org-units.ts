import { IOrgUnit } from '../types/org-unit';
import axiosInstance from './base-api';

export async function getOrgUnits(search: string) {
  const response = await axiosInstance.get<{ organisationUnits: IOrgUnit[] }>(
    `/ovc/api/organisationUnits.json?filter=displayName:ilike:${search}`
  );
  return response.data.organisationUnits;
}
