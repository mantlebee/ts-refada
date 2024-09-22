import { Any, isNullOrUndefined, List } from "@mantlebee/ts-core";

import { BooleanColumn, DateColumn, IdColumn, NumberColumn } from "@/columns";
import { IColumn } from "@/interfaces";

import { ValueConverterDefault } from "./constants";
import { ValueConverter } from "./types";

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
      result[current.name] = converter;
      return result;
    },
    {} as Record<string, ValueConverter>
  );
}
