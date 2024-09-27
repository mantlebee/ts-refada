import { Any, KeyOf, List, Nullable, ValueOrGetter } from "@mantlebee/ts-core";

import { IDatabase } from "@/interfaces";
import { ColumnRelationAbstract } from "@/models";
import { TableKey } from "@/types";

import { LookupRelationColumnOptions, TargetRowInfo } from "./types";
import { getTargetRowInfo, setRelationLookupValues } from "./utils";

export class LookupRelationColumn<
  TRow,
  TTargetRow,
  TValue = Any,
> extends ColumnRelationAbstract<
  TRow,
  TTargetRow,
  TValue,
  LookupRelationColumnOptions<TRow, TTargetRow>
> {
  public constructor(
    name: KeyOf<TRow>,
    defaultValue: TValue,
    targetTableKey: TableKey<TTargetRow>,
    public readonly targetColumnName: KeyOf<TTargetRow>,
    options: ValueOrGetter<
      LookupRelationColumnOptions<TRow, TTargetRow>,
      TRow
    > = {}
  ) {
    super(name, defaultValue, targetTableKey, options);
  }

  /**
   *
   * @param sourceRow Source row.
   * @param database The database used to retrieve the target table and row.
   * @returns A {@link TargetRowInfo} if all info are found, `null` if `table` or `row` are missing.
   */
  public getTargetRowInfo(
    sourceRow: TRow,
    database: IDatabase
  ): Nullable<TargetRowInfo<TTargetRow>> {
    return getTargetRowInfo(this, sourceRow, database);
  }

  public setValues(sourceRows: List<TRow>, targetRows: List<TTargetRow>): void {
    const { name, targetColumnName } = this;
    setRelationLookupValues(
      name,
      targetColumnName,
      sourceRows,
      targetRows,
      this.options
    );
  }
}
