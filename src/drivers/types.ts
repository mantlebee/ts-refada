import { Any } from "@mantlebee/ts-core";

import { IColumn, ITable } from "@/interfaces";

/**
 * Represent a query builder relation,
 * linking a source column to a target table.
 */
export type QueryRelation<TSourceRow, TTargetRow = Any> = {
  sourceColumn: IColumn<TSourceRow>;
  targetTable: ITable<TTargetRow>;
};
