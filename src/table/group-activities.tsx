import { createColumnHelper } from '@tanstack/react-table';

import { GroupActivities } from '../types/org-unit-about';

const columnHelper = createColumnHelper<GroupActivities>();

export const GroupActivitiesColumns = [
  columnHelper.accessor('directIndirect', {
    cell: (info) => info.getValue(),
    header: () => 'Direct/Indirect',
  }),
  // columnHelper.accessor('beneficiaryType', {
  //   cell: (info) => info.getValue(),
  //   header: 'Beneficiary Type',
  // }),
  columnHelper.accessor('code', {
    cell: (info) => info.getValue(),
    header: 'GAT. Individual Code',
  }),
  columnHelper.accessor('name', {
    cell: (info) => info.getValue(),
    header: 'Name',
  }),
  columnHelper.accessor('sex', {
    cell: (info) => info.getValue(),
    header: 'Sex',
  }),
  columnHelper.accessor('age', {
    cell: (info) => info.getValue(),
    header: 'Age',
  }),
];
