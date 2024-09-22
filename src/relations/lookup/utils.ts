import { KeyOf, List, Nullable } from "@mantlebee/ts-core";
import { extractRandomItems } from "@mantlebee/ts-random";

import { IDatabase } from "@/interfaces";

import { LookupRelationColumn } from "./models";
import { TargetRowInfo } from "./types";

function createChunks<T>(list: List<T>, size: number): List<List<T>> {
  const chunks: List<List<T>> = [];
  const listClone = [...list];
  while (chunks.length < size) {
    // last run
    if (chunks.length === size - 1) chunks.push(listClone);
    else chunks.push(extractRandomItems(listClone, true));
  }
  return chunks;
}

export function getTargetRowInfo<TSourceRow, TTargetRow>(
  sourceColumn: LookupRelationColumn<TSourceRow, TTargetRow>,
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
export function setRelationLookupValues<TSourceRow, TTargetRow>(
  sourceColumnName: KeyOf<TSourceRow>,
  targetColumnName: KeyOf<TTargetRow>,
  sourceRows: List<TSourceRow>,
  targetRows: List<TTargetRow>
): void {
  const sourceRowsChunk = createChunks(sourceRows, targetRows.length);
  targetRows.forEach((targetRow, index) => {
    sourceRowsChunk[index].forEach((sourceRow) => {
      sourceRow[sourceColumnName] = targetRow[
        targetColumnName
      ] as unknown as TSourceRow[KeyOf<TSourceRow>];
    });
  });
}
