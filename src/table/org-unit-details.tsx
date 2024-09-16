import { createColumnHelper } from '@tanstack/react-table';
import { OrgUnitDetails } from '../types/org-unit-details';
import React from 'react';
import { handleDelete } from "../components/org-unit-details/deleteRecord";

const columnHelper = createColumnHelper<OrgUnitDetails>();

export const orgUnitDetailsColumns = (credentials: string, setMessage: any, setIsError: any) => [
  // Row ID column to display row number
  columnHelper.display({
    id: 'rowNumber',
    header: 'Row ID',
    cell: (info) => info.row.index + 1,  // Add 1 to make it 1-based instead of 0-based
  }),
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
  // Custom delete column
  columnHelper.display({
    id: 'delete',
    header: 'Delete',
    cell: (info) => (
      <button
        onClick={(event) => {
          event.stopPropagation();
          const rowId = info.row.original.id;
          handleDelete(rowId, credentials, setMessage, setIsError);
        }}
        className="delete-button"
      >
        x
      </button>
    ),
  }),
];
