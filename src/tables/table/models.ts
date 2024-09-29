import { List } from "@mantlebee/ts-core";

import { IColumn, ITable } from "@/interfaces";
import { NumberOrRange } from "@/support";
import { TableKey } from "@/types";
import { getTableRows } from "@/utils";

/**
 * Implementation of {@link ITable}.
 * It uses the delegate {@link getTableRows} to generate the rows.
 */
export class Table<TRow> implements ITable<TRow> {
  protected _columns: List<IColumn<TRow>>;
  protected _rows: List<TRow> = [];

  /**
   *
   * @param key {@link TableKey}, created with {@link createTableKey}. Description must be exists.
   * @param columns List of table columns.
   */
  public constructor(
    public readonly key: TableKey<TRow>,
    columns: List<IColumn<TRow>>,
    private readonly getRowLabelDelegate?: (row: TRow) => string
  ) {
    this._columns = columns;
  }

  public get columns(): List<IColumn<TRow>> {
    return this._columns;
  }
  public get name(): string {
    return this.key.description;
  }

  public getRowLabel(row: TRow): string {
    if (this.getRowLabelDelegate) return this.getRowLabelDelegate(row);
    else return `${row[this.columns[0].name]}`;
  }
  public getRows(): List<TRow> {
    return this._rows;
  }

  public seed(rowsCount: NumberOrRange): ITable<TRow> {
    this._rows = getTableRows(this.columns, rowsCount);
    return this;
  }
}
