import { List } from "@mantlebee/ts-core";

import { IColumn, ITable } from "@/interfaces";
import { NumberOrRange } from "@/support";
import { TableKey } from "@/types";
import { getTableRows } from "@/utils";

import { Table } from "../table";

/**
 * Represents a detail table that depends on a row of another table.
 * Useful for generating detail rows based on values of a master row of a different table.
 * It works like a normal table, but the {@link setMasterRow} method must be called before the {@link seed} one.
 * @typeParam TRow - Type of the detail row.
 * @typeParam TMasterRow - Type of the master row.
 */
export class TableDetail<TRow, TMasterRow>
  extends Table<TRow>
  implements ITable<TRow>
{
  public constructor(
    key: TableKey<TRow>,
    public readonly targetTableKey: TableKey<TMasterRow>,
    private readonly getColumns: (masterRow: TMasterRow) => List<IColumn<TRow>>,
    getRowLabelDelegate?: (row: TRow) => string
  ) {
    super(key, [], getRowLabelDelegate);
  }

  public reset(): void {
    this._columns = [];
    this._rows = [];
  }

  public seed(rowsCount: NumberOrRange): ITable<TRow> {
    const rows = getTableRows(this.columns, rowsCount);
    rows.forEach((a) => this._addRow(a));
    return this;
  }

  public setMasterRow(masterRow: TMasterRow): ITable<TRow> {
    this._columns = this.getColumns(masterRow);
    return this;
  }

  protected _addRow(row: TRow): void {
    this._rows.push(row);
  }
}
