import { createColumnHelper } from '@tanstack/react-table';

import { OrgUnitDetails } from '../types/org-unit-details';

const columnHelper = createColumnHelper<OrgUnitDetails>();

export const orgUnitDetailsColumns = [
  columnHelper.accessor('id', {
    id: 'id',
  }),
  columnHelper.accessor('code', {
    cell: (info) => info.getValue(),
    header: () => 'Code',
  }),
  columnHelper.accessor('name', {
    cell: (info) => info.getValue(),
    header: () => 'Name of CSO/Partner',
  }),
  columnHelper.accessor('groupType', {
    cell: (info) => info.getValue(),
    header: () => 'Group Type',
  }),
  columnHelper.accessor('subGroup', {
    cell: (info) => info.getValue(),
    header: () => 'Sub Group',
  }),
  columnHelper.accessor('activity', {
    cell: (info) => info.getValue(),
    header: () => 'Activity',
  }),
  columnHelper.accessor('description', {
    cell: (info) => info.getValue(),
    header: () => 'Description',
  }),
  columnHelper.accessor('dateOfActivity', {
    cell: (info) => info.getValue(),
    header: () => 'Date of Activity',
  }),
  columnHelper.accessor('venue', {
    cell: (info) => info.getValue(),
    header: () => 'Venue',
  }),
];
