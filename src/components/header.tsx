import { ReactNode } from 'react';
import React from 'react';

type Props = {
  search: string;
  onSearch: (value: string) => void;
  onAdd: () => void;
  back?: ReactNode;
  front?: ReactNode;
};

export function Header(props: Props) {
  return (
    <header className="flex items-center justify-between">
      <div className="space-x-4">
        {props.back}
        <input
          className="border text-sm py-1 px-4 rounded-md"
          placeholder="Search"
          value={props.search}
          onChange={(e) => props.onSearch(e.target.value)}
        />
      </div>
      <div className="space-x-4">
        <button
          className="py-1 px-4 bg-green-500 text-white rounded-md text-sm"
          onClick={props.onAdd}
        >
          Add +
        </button>
        {props.front}
      </div>
    </header>
  );
}
