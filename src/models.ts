import { Any, KeyOf, List, ValueOrGetter } from "@mantlebee/ts-core";

import { IColumn, IDatabase, ITable, IColumnRelation } from "./interfaces";
import { NumberOrRange } from "./support";
import { Dataset, ColumnOptions, RowsCountsMap, TableKey } from "./types";
import { getDatabaseDataset, getTableRows } from "./utils";

/**
 * Abstract implementation of {@link IColumn}.
 */
export abstract class ColumnAbstract<
  TRow,
  TValue = Any,
  TOptions extends ColumnOptions = ColumnOptions,
> implements IColumn<TRow, TValue>
{
  public readonly name: KeyOf<TRow>;

  public constructor(
    name: KeyOf<TRow>,
    public readonly options: ValueOrGetter<TOptions, TRow> = {} as TOptions
  ) {
    this.name = name;
  }

  public abstract getValue(row: TRow): TValue;
}

/**
 * Abstract implementation of {@link IColumnRelation}
 */
export abstract class ColumnRelationAbstract<
    TRow,
    TTargetRow,
    TValue = Any,
    TOptions extends ColumnOptions = ColumnOptions,
  >
  extends ColumnAbstract<TRow, TValue, TOptions>
  implements IColumnRelation<TRow, TTargetRow, TValue>
{
  private defaultValue: TValue;
  public targetTableKey: TableKey<TTargetRow>;

  public constructor(
    name: KeyOf<TRow>,
    defaultValue: TValue,
    targetTableKey: TableKey<TTargetRow>,
    options: ValueOrGetter<TOptions, TRow> = {} as TOptions
  ) {
    super(name, options);
    this.defaultValue = defaultValue;
    this.targetTableKey = targetTableKey;
  }

  public getValue(): TValue {
    return this.defaultValue;
  }

  public abstract setValues(
    sourceRows: List<TRow>,
    targetRows: List<TTargetRow>,
    dataset: Dataset
  ): void;
}

/**
 * Implementation of {@link IDatabase}.
 * It uses the delegate {@link getDatabaseDataset} to generate the dataset.
 * The resulting {@link Dataset} can be accessed both through the table's name and key.
 */
export class Database implements IDatabase {
  private _dataset: Dataset = {};

  public constructor(public readonly tables: List<ITable<Any>>) {}

  public getDataset(): Dataset {
    return this._dataset;
  }
  public getTable<TRow>(tableKey: TableKey<TRow>): ITable<TRow> {
    return this.tables.find((a) => a.key === tableKey)!;
  }

  /**
   * Generates the database dataset, it is a dictionary, where the keys are the tables' keys, and the values are the generated rows.
   * @param rowsCountsMap Dictionary with the tables counts, used to generate a specific amount of rows for each table. It is a dictionary where the keys are the tables' keys, and the values the row counts to generate.
   * @returns the database instance. Useful to concatenate operations.
   */
  public seed(rowsCountsMap: RowsCountsMap): IDatabase {
    this._dataset = getDatabaseDataset(this.tables, rowsCountsMap);
    return this;
  }
}

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
