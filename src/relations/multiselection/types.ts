import { ITable } from "@/interfaces";
import { ColumnOptions } from "@/types";

export type MultiselectionRelationColumnOptions<TSourceRow, TTargetRow> =
  ColumnOptions & {
    /**
     * Target rows filter delegate.
     * If defined, each source rows extract random target rows,
     * from a filtered subset of all the target rows.
     * @param targetRow target row to include in the list of items to extract from.
     * @param sourceRow source row used to filter target rows, using some other field value.
     * @returns true if target row must be included in the list of items to extract from.
     */
    filter?: (targetRow: TTargetRow, sourceRow: TSourceRow) => boolean;
  };

/**
 * Defines the target row details.
 */
export type TargetRowInfo<TTargetRow> = {
  /**
   * The target row label, generated through the table's {@link getRowLabel} method.
   */
  label: string;
  row: TTargetRow;
  table: ITable<TTargetRow>;
};
