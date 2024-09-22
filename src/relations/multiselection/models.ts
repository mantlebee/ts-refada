import { Any, KeyOf, List, Nullable, ValueOrGetter } from "@mantlebee/ts-core";

import { IDatabase } from "@/interfaces";
import { ColumnRelationAbstract } from "@/models";
import { ColumnOptions, TableKey } from "@/types";

import { getTargetRowInfo, setRelationMultiselectionValues } from "./utils";
import { TargetRowInfo } from "./types";

export class MultiselectionRelationColumn<
  TRow,
  TTargetRow,
  TValue = Any,
  TOptions extends ColumnOptions = ColumnOptions,
> extends ColumnRelationAbstract<TRow, TTargetRow, List<TValue>, TOptions> {
  public constructor(
    name: KeyOf<TRow>,
    targetTableKey: TableKey<TTargetRow>,
    public readonly targetColumnName: KeyOf<TTargetRow>,
    options: ValueOrGetter<TOptions, TRow> = {} as TOptions
  ) {
    super(name, [], targetTableKey, options);
  }

  public getTargetRowInfo(
    sourceRow: TRow,
    database: IDatabase
  ): Nullable<TargetRowInfo<TTargetRow>> {
    return getTargetRowInfo(this, sourceRow, database);
  }

  public setValues(sourceRows: List<TRow>, targetRows: List<TTargetRow>): void {
    const { name, targetColumnName } = this;
    setRelationMultiselectionValues(
      name,
      targetColumnName,
      sourceRows,
      targetRows
    );
  }
}
