import { List } from "@mantlebee/ts-core";

import { IColumn, IDatabase, ITable } from "@/interfaces";
import { Database } from "@/models";
import { Table, ConstantTable, DetailTable } from "@/tables";
import { RowsCountsMap, TableKey } from "@/types";

import { adaptRowsValues } from "./utils";

/**
 * Sqlite3 adapter for {@link ConstantTable}.
 * When instantiated, adapts the rows values.
 * ATTENTION: rows are not cloned; values are updated on the same instance.
 */
export class Sqlite3ConstantTable<TRow> extends ConstantTable<TRow> {
  public constructor(
    key: TableKey<TRow>,
    rows: List<TRow>,
    columns: List<IColumn<TRow>> = [],
    getRowLabelDelegate?: (row: TRow) => string
  ) {
    const adaptedRows = [...rows];
    adaptRowsValues(columns, ...adaptedRows);
    super(key, adaptedRows, columns, getRowLabelDelegate);
  }
}

/**
 * Sqlite3 adapter for {@link Database}.
 * During the seed operation, adapts the rows values of all tables.
 * ATTENTION: rows are not cloned; values are updated on the same instance.
 */
export class Sqlite3Database extends Database {
  public seed(rowsCountsMap: RowsCountsMap): IDatabase {
    super.seed(rowsCountsMap);
    const dataset = this.getDataset();
    this.tables.forEach((table) =>
      adaptRowsValues(table.columns, ...dataset[table.key])
    );
    return this;
  }
}

/**
 * Sqlite3 adapter for {@link DetailTable}.
 * During the protected {@link _addRow} method, adapts the row's values.
 * ATTENTION: rows are not cloned; values are updated on the same instance.
 */
export class Sqlite3DetailTable<TRow, TMasterRow> extends DetailTable<
  TRow,
  TMasterRow
> {
  protected _addRow(row: TRow): void {
    adaptRowsValues(this.columns, row);
    super._addRow(row);
  }
}

/**
 * Sqlite3 adapter for {@link Table}.
 * During the seed operation, adapts the rows values.
 * ATTENTION: rows are not cloned; values are updated on the same instance.
 */
export class Sqlite3Table<TRow> extends Table<TRow> {
  public seed(rowsCount: number): ITable<TRow> {
    const rows = super.seed(rowsCount).getRows();
    adaptRowsValues(this.columns, ...rows);
    return this;
  }
}
