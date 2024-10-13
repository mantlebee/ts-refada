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
import { shouldBeNull } from "@/utils";

import { MultiselectionRelationColumn } from "./models";
import { MultiselectionRelationColumnOptions, TargetRowInfo } from "./types";

/**
 * Returns info of the target row, useful to display something different from the column value.
 * @param sourceRow Source row.
 * @param database The database used to retrieve the target table and row.
 * @returns A {@link TargetRowInfo} if all info are found, `null` if `table` or `row` are missing.
 */
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

/**
 * Iterates on all source rows to update the column value,
 * picking it randomly unique values from a different table.
 * @param sourceColumnName Name of the source column.
 * @param targetColumnName name of the target column.
 * @param sourceRows List of source rows to update.
 * @param targetRows List of target rows to count.
 * @param options Multiselection relation column options.
 */
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
