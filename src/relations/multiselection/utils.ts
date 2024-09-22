import { Any, KeyOf, List, Nullable } from "@mantlebee/ts-core";
import { extractRandomItems } from "@mantlebee/ts-random";

import { IDatabase } from "@/interfaces";

import { MultiselectionRelationColumn } from "./models";
import { TargetRowInfo } from "./types";

export function getTargetRowInfo<TSourceRow, TTargetRow>(
  sourceColumn: MultiselectionRelationColumn<TSourceRow, TTargetRow>,
  sourceRow: TSourceRow,
  database: IDatabase
): Nullable<TargetRowInfo<TTargetRow>> {
  const table = database.getTable(sourceColumn.targetTableKey);
  if (table) {
    const sourceValue = sourceRow[sourceColumn.name] as unknown;
    const row = table
      .getRows()
      .find((a) => a[sourceColumn.targetColumnName] === sourceValue);
    if (row) {
      const label = table.getRowLabel(row);
      return { label, row, table };
    }
  }
  return null;
}

export function setRelationMultiselectionValues<TSourceRow, TTargetRow>(
  sourceColumnName: KeyOf<TSourceRow>,
  targetColumnName: KeyOf<TTargetRow>,
  sourceRows: List<TSourceRow>,
  targetRows: List<TTargetRow>
): void {
  sourceRows.forEach((sourceRow) => {
    sourceRow[sourceColumnName] = extractRandomItems([...targetRows], true).map(
      (targetRow) => targetRow[targetColumnName]
    ) as Any;
  });
}
