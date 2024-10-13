import { KeyOf, List } from "@mantlebee/ts-core";

import { RelationCountCondition } from "./types";

/**
 * Iterates on all source rows to update the column value,
 * counting target rows that satisfie the {@link countCondition}.
 * @param sourceColumnName Name of the source column.
 * @param countCondition Count condition delegate to include or not target row in the count.
 * @param sourceRows List of source rows to update.
 * @param targetRows List of target rows to count.
 */
export function setRelationCountValues<TSourceRow, TTargetRow>(
  sourceColumnName: KeyOf<TSourceRow>,
  countCondition: RelationCountCondition<TSourceRow, TTargetRow>,
  sourceRows: List<TSourceRow>,
  targetRows: List<TTargetRow>
): void {
  sourceRows.forEach((sourceRow) => {
    const count = targetRows.filter((targetRow) =>
      countCondition(sourceRow, targetRow)
    ).length;
    sourceRow[sourceColumnName] = count as TSourceRow[KeyOf<TSourceRow>];
  });
}
