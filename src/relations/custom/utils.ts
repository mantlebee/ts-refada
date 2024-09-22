import { KeyOf, List } from "@mantlebee/ts-core";

import { Dataset } from "@/types";

import { RelationCustomValueGetter } from "./types";

export function setRelationCustomValues<TSourceRow, TTargetRow, TValue>(
  sourceColumnName: KeyOf<TSourceRow>,
  getValueDelegate: RelationCustomValueGetter<TSourceRow, TTargetRow, TValue>,
  sourceRows: List<TSourceRow>,
  targetRows: List<TTargetRow>,
  dataset: Dataset
): void {
  sourceRows.forEach((sourceRow) => {
    sourceRow[sourceColumnName] = getValueDelegate(
      sourceRow,
      targetRows,
      dataset
    ) as unknown as TSourceRow[KeyOf<TSourceRow>];
  });
}
