import { useState } from 'react';

import { Header } from '../header';
import { Table, TablePagination } from '../common/table';
import { orgUnitDetailsColumns } from '../../table/org-unit-details';
import { OrgUnitDetails } from '../../types/org-unit-details';
import { useTable } from '../../hooks/use-table';
import { useHistory } from 'react-router-dom';
import React from 'react';

type Props = {
  orgUnitDetails: OrgUnitDetails[];
  orgUnitId: string;
};

export function OrgUnitTable(props: Props) {
  const [search, setSearch] = useState('');
  const history = useHistory();

  const table = useTable({
    data: props.orgUnitDetails,
    columns: orgUnitDetailsColumns,
    globalFilter: search,
    setGlobalFilter: setSearch,
  });

  function onAdd() {}

  return (
    <main className="space-y-4">
      <Header onAdd={onAdd} search={search} onSearch={setSearch} />
      <Table
        table={table}
        onRowClick={(row) => {
          const id = row.getValue('id');
          history.push(`/${props.orgUnitId}/${id}/about`);
        }}
      />
      <TablePagination table={table} />
    </main>
  );
}
