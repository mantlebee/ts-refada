import { DateColumnOption } from "@/columns";
import { ColumnOptions } from "@/types";

/**
 * {@link DateFromRelationColumn} options.
 */
export type DateFromRelationColumnOptions = ColumnOptions & {
  to?: Date | DateColumnOption;
};

/**
 * {@link DateFromRelationColumn} options getter.
 * The second parameter is the target row of the relation.
 */
export type DateFromRelationColumnOptionsGetter<TSourceRow, TTargetRow> = (
  sourceRow: TSourceRow,
  targetRow: TTargetRow
) => DateFromRelationColumnOptions;

/**
 * Type of the delegate to find the target row of the relation.
 */
export type RelationDateFromCondition<TSourceRow, TTargetRow> = (
  sourceRow: TSourceRow,
  targetRow: TTargetRow
) => boolean;
