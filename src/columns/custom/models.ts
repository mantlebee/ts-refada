import { KeyOf } from "@mantlebee/ts-core";

import { ColumnAbstract } from "@/models";

/**
 * Generic column. Generates a value using a delegate passed to the constructor.
 */
export class CustomColumn<TRow, TValue> extends ColumnAbstract<TRow, TValue> {
  /**
   * Delegate used to generate the value.
   * The row passed as param has the values of the previous columns already processed.
   */
  private readonly getValueDelegate!: (row: TRow) => TValue;

  /**
   * @param name Name of the column and of the field.
   * @param getValueDelegate Delegate used to generate the value. The row passed as param has the values of the previous columns already processed.
   */
  public constructor(
    name: KeyOf<TRow>,
    getValueDelegate: (row: TRow) => TValue
  ) {
    super(name);
    this.getValueDelegate = getValueDelegate;
  }

  public getValue(row: TRow): TValue {
    return this.getValueDelegate(row);
  }
}
