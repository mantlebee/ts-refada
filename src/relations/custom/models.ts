import { Any, KeyOf, List, ValueOrGetter } from "@mantlebee/ts-core";

import { ColumnRelationAbstract } from "@/models";
import { ColumnOptions, Dataset, TableKey } from "@/types";

import { RelationCustomValueGetter } from "./types";
import { setRelationCustomValues } from "./utils";

export class CustomRelationColumn<
  TRow,
  TTargetRow,
  TValue = Any,
  TOptions extends ColumnOptions = ColumnOptions,
> extends ColumnRelationAbstract<TRow, TTargetRow, TValue, TOptions> {
  public constructor(
    name: KeyOf<TRow>,
    defaultValue: TValue,
    targetTableKey: TableKey<TTargetRow>,
    protected readonly getValueDelegate: RelationCustomValueGetter<
      TRow,
      TTargetRow,
      TValue
    >,
    options: ValueOrGetter<TOptions, TRow> = {} as TOptions
  ) {
    super(name, defaultValue, targetTableKey, options);
  }

  public setValues(
    sourceRows: List<TRow>,
    targetRows: List<TTargetRow>,
    dataset: Dataset
  ): void {
    const { getValueDelegate, name } = this;
    setRelationCustomValues(
      name,
      getValueDelegate,
      sourceRows,
      targetRows,
      dataset
    );
  }
}
