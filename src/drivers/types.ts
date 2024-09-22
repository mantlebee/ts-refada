import { Any } from "@mantlebee/ts-core";

import { IColumn, ITable } from "@/interfaces";

export type QueryRelation<TSourceRow, TTargetRow = Any> = {
  sourceColumn: IColumn<TSourceRow>;
  targetTable: ITable<TTargetRow>;
};
