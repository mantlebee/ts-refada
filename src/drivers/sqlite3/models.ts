import { IDatabase, ITable } from "@/interfaces";
import { Database } from "@/models";
import { Table, ConstantTable, DetailTable } from "@/tables";
import { RowsCountsMap } from "@/types";

import { adaptRowsValues } from "./utils";

export class Sqlite3ConstantTable<TRow> extends ConstantTable<TRow> {}

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

export class Sqlite3DetailTable<TRow, TMasterRow> extends DetailTable<
  TRow,
  TMasterRow
> {
  protected _addRow(row: TRow): void {
    adaptRowsValues(this.columns, row);
    super._addRow(row);
  }
}

export class Sqlite3Table<TRow> extends Table<TRow> {
  public seed(rowsCount: number): ITable<TRow> {
    const rows = super.seed(rowsCount).getRows();
    adaptRowsValues(this.columns, ...rows);
    return this;
  }
}
