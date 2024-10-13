import { KeyOf, List } from "@mantlebee/ts-core";

import { Dataset } from "@/types";

import { RelationCustomValueGetter } from "./types";

/**
 * Iterates on all source rows to update the column value,
 * using the {@link getValueDelegate} method.
 * @param sourceColumnName Name of the source column.
 * @param getValueDelegate Delegate used to generate the value.
 * @param sourceRows List of source rows to update.
 * @param targetRows List of target rows to count.
 * @param dataset All dataset, if needed by the {@link getValueDelegate} method.
 */
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
