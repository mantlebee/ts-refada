import { Any, KeyOf, List, Nullable, ValueOrGetter } from "@mantlebee/ts-core";

import { IDatabase } from "@/interfaces";
import { ColumnRelationAbstract } from "@/models";
import { TableKey } from "@/types";

import { getTargetRowInfo, setRelationMultiselectionValues } from "./utils";
import { MultiselectionRelationColumnOptions, TargetRowInfo } from "./types";

export class MultiselectionRelationColumn<
  TRow,
  TTargetRow,
  TValue = Any,
> extends ColumnRelationAbstract<
  TRow,
  TTargetRow,
  List<TValue>,
  MultiselectionRelationColumnOptions<TRow, TTargetRow>
> {
  public constructor(
    name: KeyOf<TRow>,
    targetTableKey: TableKey<TTargetRow>,
    public readonly targetColumnName: KeyOf<TTargetRow>,
    options: ValueOrGetter<
      MultiselectionRelationColumnOptions<TRow, TTargetRow>,
      TRow
    > = {}
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
      targetRows,
      this.options
    );
  }
}
