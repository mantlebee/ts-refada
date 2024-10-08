import { KeyOf, NumericIdentityManager } from "@mantlebee/ts-core";

import { ColumnAbstract } from "@/models";

/**
 * Generates a unique and incremental positive number.
 * It is possible to choose the starting value.
 */
export class IdColumn<TRow> extends ColumnAbstract<TRow, number> {
  private readonly identityManager!: NumericIdentityManager;

  /**
   * @param name Name of the column and of the field.
   * @param startsFrom Initial value, default is 1.
   */
  public constructor(name: KeyOf<TRow>, startsFrom?: number) {
    super(name);
    this.identityManager = new NumericIdentityManager(
      startsFrom && startsFrom - 1
    );
  }

  public getValue(): number {
    return this.identityManager.newValue();
  }
}
