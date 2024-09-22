import { KeyOf, List } from "@mantlebee/ts-core";

import { ColumnRelationAbstract } from "@/models";
import { TableKey } from "@/types";

import { RelationCountCondition } from "./types";
import { setRelationCountValues } from "./utils";

export class CountRelationColumn<
  TRow,
  TTargetRow,
> extends ColumnRelationAbstract<TRow, TTargetRow, number> {
  public constructor(
    name: KeyOf<TRow>,
    targetTableKey: TableKey<TTargetRow>,
    protected readonly countCondition: RelationCountCondition<TRow, TTargetRow>
  ) {
    super(name, 0, targetTableKey);
  }

  public setValues(sourceRows: List<TRow>, targetRows: List<TTargetRow>): void {
    const { countCondition, name } = this;
    setRelationCountValues(name, countCondition, sourceRows, targetRows);
  }
}
