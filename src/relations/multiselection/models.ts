import { Any, KeyOf, List, Nullable, ValueOrGetter } from "@mantlebee/ts-core";

import { IDatabase } from "@/interfaces";
import { ColumnRelationAbstract } from "@/models";
import { TableKey } from "@/types";

import { MultiselectionRelationColumnOptions, TargetRowInfo } from "./types";
import { getTargetRowInfo, setRelationMultiselectionValues } from "./utils";

/**
 * Picks values from a different column of a target row.
 * Values must be unique, like id or guid.
 */
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

  /**
   * Returns info of the target row, useful to display something different from the column value.
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
    setRelationMultiselectionValues(
      name,
      targetColumnName,
      sourceRows,
      targetRows,
      this.options
    );
  }
}
