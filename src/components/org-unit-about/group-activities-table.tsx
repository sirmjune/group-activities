import { useState } from 'react';

import { Link } from 'react-router-dom';

import { Table, TablePagination } from '../common/table';
import { Header } from '../header';
import { GroupActivitiesColumns } from '../../table/group-activities';
import { useTable } from '../../hooks/use-table';
import { GroupActivities } from '../../types/org-unit-about';
import React from 'react';

type Props = {
  data: GroupActivities[];
  orgUnitId: string;
  detailsId: string;
};

export function GroupActivitiesTable(props: Props) {
  const [search, setSearch] = useState('');
 console.log("about data", props.data);
  const table = useTable({
    data: props.data,
    columns: GroupActivitiesColumns,
    globalFilter: search,
    setGlobalFilter: setSearch,
  });

  function onAdd() {}

  return (
    <main className="space-y-4">
      <Header
        onAdd={onAdd}
        onSearch={setSearch}
        search={search}
        back={
          <Link to={`/${props.orgUnitId}`}>
            <button className="py-1 px-4 bg-black text-white rounded-md text-sm">
              Back
            </button>
          </Link>
        }
        front={
          <Link to={`/${props.orgUnitId}/${props.detailsId}/sessions`}>
            <button className="py-1 px-4 bg-black text-white rounded-md text-sm">
              Sessions
            </button>
          </Link>
        }
      />
      <Table table={table} />
      <TablePagination table={table} />
    </main>
  );
}
