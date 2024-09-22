import { ITable } from "@/interfaces";
import { Table, TableDetail } from "@/models";

import { adaptRowsValues } from "./utils";

export class Sqlite3Table<TRow> extends Table<TRow> {
  public seed(rowsCount: number): ITable<TRow> {
    const rows = super.seed(rowsCount).getRows();
    adaptRowsValues(this.columns, ...rows);
    return this;
  }
}

export class Sqlite3TableDetail<TRow, TMasterRow> extends TableDetail<
  TRow,
  TMasterRow
> {
  protected _addRow(row: TRow): void {
    adaptRowsValues(this.columns, row);
    super._addRow(row);
  }
}
