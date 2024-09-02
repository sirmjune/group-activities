import { useState } from 'react';

import { Link } from 'react-router-dom';

import { Table, TablePagination } from '../common/table';
import { Header } from '../header';
import { useTable } from '../../hooks/use-table';
import { Session } from '../../types/org-unit-about';
import { sessionsColumns } from '../../table/sessions';
import React from 'react';

type Props = {
  data: Session[];
  orgUnitId: string;
  detailsId: string;
};

export function SessionsTable(props: Props) {
  const [search, setSearch] = useState('');
// console.log("sessionsTable",props.data);
  const table = useTable({
    data: props.data,
    columns: sessionsColumns,
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
          <Link to={`/${props.orgUnitId}/${props.detailsId}/about`}>
            <button className="py-1 px-4 bg-black text-white rounded-md text-sm">
              Back
            </button>
          </Link>
        }
      />
      <Table table={table} />
      <TablePagination table={table} />
    </main>
  );
}

