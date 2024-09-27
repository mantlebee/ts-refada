import {
  Any,
  getValue,
  KeyOf,
  List,
  Nullable,
  ValueOrGetter,
} from "@mantlebee/ts-core";
import { extractRandomItems } from "@mantlebee/ts-random";

import { IDatabase } from "@/interfaces";

import { MultiselectionRelationColumn } from "./models";
import { MultiselectionRelationColumnOptions, TargetRowInfo } from "./types";
import { shouldBeNull } from "@/utils";

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
  targetRows: List<TTargetRow>,
  options: ValueOrGetter<
    MultiselectionRelationColumnOptions<TSourceRow, TTargetRow>,
    TSourceRow
  > = {}
): void {
  sourceRows.forEach((sourceRow) => {
    const rowOptions = getValue(options, sourceRow);
    if (shouldBeNull(rowOptions)) sourceRow[sourceColumnName] = null as Any;
    else {
      const availableTargetRows = rowOptions?.filter
        ? targetRows.filter((a) => rowOptions?.filter!(a, sourceRow))
        : [...targetRows];
      sourceRow[sourceColumnName] = extractRandomItems(
        availableTargetRows,
        true
      ).map((a) => a[targetColumnName]) as Any;
    }
  });
}
