import { Any, isNumber, List } from "@mantlebee/ts-core";

import { BooleanColumn, DateColumn, IdColumn, NumberColumn } from "@/columns";
import { IColumn } from "@/interfaces";
import { MultiselectionRelationColumn } from "@/relations";

import { ValueConverterDefault } from "./constants";
import { ValueConverter } from "./types";

/**
 * Iterates on the rows to update the values.
 * @param columns List of the columns of the rows.
 * @param rows the rows to update the values.
 */
export function adaptRowsValues<TRow>(
  columns: List<IColumn<TRow>>,
  ...rows: List<TRow>
): void {
  const convertersMap = createValueConvertersMap(columns);
  rows.forEach((row) => {
    columns.forEach((column) => {
      let value = row[column.name] as Any;
      if (value === null) value = "null";
      else value = convertersMap[column.name](value);
      row[column.name] = value;
    });
  });
}

/**
 * Creates a value converters map.
 * Each converter depends on the source column value type.
 * @param columns List of the columns for row's values convertion.
 * @returns the value converters map.
 */
function createValueConvertersMap<TRow>(
  columns: List<IColumn<TRow>>
): Record<string, ValueConverter> {
  return columns.reduce(
    (result, current) => {
      let converter = ValueConverterDefault;
      if (current instanceof BooleanColumn) converter = (a) => (a ? 1 : 0);
      else if (current instanceof DateColumn)
        converter = (a) =>
          ValueConverterDefault(
            a.toISOString().replace("T", " ").replace("Z", "000")
          );
      else if (current instanceof IdColumn || current instanceof NumberColumn)
        converter = (a) => a;
      else if (current instanceof MultiselectionRelationColumn)
        converter = (values) =>
          values.map((a: Any) => (isNumber(a) ? a : ValueConverterDefault(a)));
      result[current.name] = converter;
      return result;
    },
    {} as Record<string, ValueConverter>
  );
}
