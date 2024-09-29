import { Any, KeyOf, List, ValueOrGetter } from "@mantlebee/ts-core";

import { IColumn, IDatabase, ITable, IColumnRelation } from "./interfaces";
import { Dataset, ColumnOptions, RowsCountsMap, TableKey } from "./types";
import { getDatabaseDataset } from "./utils";

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
