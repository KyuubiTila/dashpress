import { useState } from "react";

import {
  Table,
  DEFAULT_TABLE_PARAMS,
  TableSkeleton,
  ITableColumn,
} from "@hadmean/chromista";
import { IPaginatedDataState } from "@hadmean/protozoa";
import { ViewStateMachine } from "../ViewStateMachine";
import { useFEPaginatedData } from "./useFEPagination";

interface IProps {
  columns: ITableColumn[];
  dataEndpoint: string;
  emptyMessage?: string;
}

export function FEPaginationTable<T extends Record<string, unknown>>({
  columns,
  dataEndpoint,
  emptyMessage,
}: IProps) {
  const [paginatedDataState, setPaginatedDataState] = useState<
    IPaginatedDataState<T>
  >(DEFAULT_TABLE_PARAMS as IPaginatedDataState<unknown>);

  const tableData = useFEPaginatedData<T>(dataEndpoint, {
    ...paginatedDataState,
    sortBy: paginatedDataState.sortBy,
    pageIndex: paginatedDataState.pageIndex + 1,
    filters: undefined,
    // filters: {
    //   label: "Root User",
    // },
  });

  return (
    <ViewStateMachine
      error={tableData.error}
      loading={tableData.isLoading}
      loader={<TableSkeleton />}
    >
      <Table
        {...{
          tableData,
          setPaginatedDataState,
          paginatedDataState,
        }}
        emptyMessage={emptyMessage}
        columns={columns}
      />
    </ViewStateMachine>
  );
}
