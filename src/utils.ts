import { Any, List, KeyOf, getValue, isNumber } from "@mantlebee/ts-core";
import {
  generateRandomBoolean,
  generateRandomNumber,
} from "@mantlebee/ts-random";

import { IColumn, ITable } from "./interfaces";
import { ColumnRelationAbstract } from "./models";
import { getNumberFromRange, NumberOrRange } from "./support";
import { TableDetail } from "./tables";
import { ColumnOptions, RowsCountsMap, Dataset, TableKey } from "./types";

/**
 * Creates a typed key for the {@link Table} model.
 * The `description` property of the key is the name of the table.
 */
export const createTableKey = <TRow>(tableName: string) =>
  Symbol(tableName) as TableKey<TRow>;

/**
 * Generates a database dataset using the given tables and relations.
 * It is separated into two steps:
 *  1. it generates the table rows.
 *  2. process the relation columnss to update the rows values.
 * Columns of type relation of the tables are processed during the second step if and only if a relation referring that column is present. If not, the default value is not updated.
 * @param tables List of tables forming part of the database.
 * @param rowsCountsMap Dictionary with the tables counts, used to generate a specific amount of rows for each table. It is a dictionary where the keys are the tables keys and the values the row counts to generate.
 * @returns the database dataset, it is a dictionary, where the keys are the tables' keys, and the values are the generated rows.
 */
export function getDatabaseDataset(
  tables: List<ITable<Any>>,
  rowsCountsMap: RowsCountsMap
): Dataset {
  const dataset: Dataset = {};

  const updateDataset = (table: ITable<Any>) => {
    const key = table.key;
    const count = getNumberFromRange(rowsCountsMap[key] || 0);
    table.seed(count);
    const rows = table.getRows();
    dataset[key] = rows;
    dataset[key.description] = rows;
  };

  const updateRelationValues = (table: ITable<Any>) => {
    table.columns
      .filter((a) => a instanceof ColumnRelationAbstract)
      .forEach((column) => {
        const sourceRows = dataset[table.key];
        const targetRows = dataset[column.targetTableKey];
        if (sourceRows && targetRows)
          column.setValues(sourceRows, targetRows, dataset);
      });
  };

  const masterTables = tables.filter((a) => !(a instanceof TableDetail));
  masterTables.forEach(updateDataset);
  masterTables.forEach(updateRelationValues);

  const detailTables = tables.filter((a) => a instanceof TableDetail);
  detailTables.forEach((table) => {
    table.reset();
    const masterRows = dataset[table.targetTableKey];
    masterRows.forEach((a) => {
      table.setMasterRow(a);
      updateDataset(table);
    });
  });
  detailTables.forEach((table) => {
    const masterRows = dataset[table.targetTableKey];
    masterRows.forEach((a) => {
      table.setMasterRow(a);
      updateRelationValues(table);
    });
  });

  return dataset;
}

export const getDatasetRows = <TRow>(
  dataset: Dataset,
  tableKey: TableKey<TRow>
) => dataset[tableKey] as List<TRow>;

/**
 * Generates rows for a table where the keys are the columns names.
 * If the column if nullable, the {@link shouldBeNull} defines if the `null` value is used or a random one must be generated by the column {@link IColumn["getValue"]} method.
 * @param columns List of columns used to update the rows values.
 * @param rowsCount Number of rows to generated.
 * @returns Rows generated where the keys are the columns names.
 */
export function getTableRows<TRow>(
  columns: List<IColumn<TRow, Any>>,
  rowsCount: NumberOrRange
): List<TRow> {
  rowsCount = getNumberFromRange(rowsCount);
  const items: List<TRow> = [];
  for (let i = 0; i < rowsCount; i++) {
    const row: TRow = {} as TRow;
    columns.forEach((a) => {
      const options = getValue(a.options, row)!;
      if (shouldBeNull(options, a)) row[a.name] = null as TRow[KeyOf<TRow>];
      else row[a.name] = a.getValue(row);
    });
    items.push(row);
  }
  return items;
}

/**
 * Defines if the column value must be set on `null`.
 * The output depends on the following cases:
 * - the nullable option is a probability percentage => generates a random percentage and returns true if it is less or equal the nullable option value..
 * - the nullable option is a boolean => generates a random boolean.
 * - the column (if given) is not nullable => false.
 * - the column (if given) is a relation column and it is nullable => true (ignoring that the nullable option could be a probability percentage).
 * @param options The column options, where the nullable option can be a boolean or a probability percentage.
 * @param column Column processing during the table rows generation.
 * @returns A boolean value indicating if the row value of the current column must be set on `null`.
 */
export function shouldBeNull<TRow>(
  options: ColumnOptions,
  column?: IColumn<TRow>
): boolean {
  const { nullable } = options;
  // Value is not `null` if nullable is `false` or `0`.
  if (!nullable) return false;
  // Value is `null` if the column is a nullable relation column (ignoring any probability percentage).
  if (column instanceof ColumnRelationAbstract && nullable) return true;
  // Value could be `null` if the nullable option is a number and a random generated percentage is less or equal its value.
  if (isNumber(nullable))
    return generateRandomNumber(100) <= (nullable as number);
  // Value could be `null`, based on a random generated boolean.
  return generateRandomBoolean();
}
