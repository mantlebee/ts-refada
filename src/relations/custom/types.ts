import { List } from "@mantlebee/ts-core";

import { Dataset } from "@/types";

export type RelationCustomValueGetter<TSourceRow, TTargetRow, TValue> = (
  sourceRow: TSourceRow,
  targetRows: List<TTargetRow>,
  dataset: Dataset
) => TValue;
