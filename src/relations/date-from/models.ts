import { KeyOf, List } from "@mantlebee/ts-core";

import { ColumnRelationAbstract } from "@/models";
import { TableKey } from "@/types";

import {
  DateFromRelationColumnOptions,
  DateFromRelationColumnOptionsGetter,
  RelationDateFromCondition,
} from "./types";
import { setRelationDateFromValues } from "./utils";

/**
 * Generates a random date, starting from a value of a target row.
 * Use Case: every comment of a post, must have a creation date that follows the creation date of the post.
 * Similar to {@link DateColumn}, it is possible to restrict the range,
 * specifing a `to` option, to limit the right-range.
 */
export class DateFromRelationColumn<
  TRow,
  TTargetRow,
> extends ColumnRelationAbstract<
  TRow,
  TTargetRow,
  Date,
  DateFromRelationColumnOptions
> {
  /**
   * @param name Name of the column and of the field.
   * @param targetTableKey Target table's typed-key.
   * @param targetColumnName Target related row column name.
   * @param findTargetRow Delegate to find the target related row.
   * @param getOptions Column options getter.
   */
  public constructor(
    name: KeyOf<TRow>,
    targetTableKey: TableKey<TTargetRow>,
    protected readonly targetColumnName: KeyOf<TTargetRow>,
    protected readonly findTargetRow: RelationDateFromCondition<
      TRow,
      TTargetRow
    >,
    protected readonly getOptions?: DateFromRelationColumnOptionsGetter<
      TRow,
      TTargetRow
    >
  ) {
    super(name, new Date(), targetTableKey);
  }

  public setValues(sourceRows: List<TRow>, targetRows: List<TTargetRow>): void {
    const { findTargetRow, getOptions, name, targetColumnName } = this;
    setRelationDateFromValues(
      name,
      targetColumnName,
      findTargetRow,
      sourceRows,
      targetRows,
      getOptions
    );
  }
}
