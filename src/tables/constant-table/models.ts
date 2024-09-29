import { List } from "@mantlebee/ts-core";

import { IColumn, ITable } from "@/interfaces";
import { NumberOrRange } from "@/support";
import { TableKey } from "@/types";

import { Table } from "../table";

/**
 * Implementation of {@link ITable} for constant tables.
 * Constant tables are tables where data never changes.
 * In constant tables, columns are optional.
 */
export class ConstantTable<TRow> extends Table<TRow> {
  public constructor(
    key: TableKey<TRow>,
    rows: List<TRow>,
    columns: List<IColumn<TRow>> = [],
    getRowLabelDelegate?: (row: TRow) => string
  ) {
    super(key, columns, getRowLabelDelegate);
    this._rows = rows;
  }

  public seed(rowsCount: NumberOrRange): ITable<TRow> {
    return this;
  }

  public updateRows(rows: List<TRow>) {
    this._rows = rows;
  }
}
