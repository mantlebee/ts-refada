import { generateRandomBoolean } from "@mantlebee/ts-random";

import { ColumnAbstract } from "@/models";

/**
 * Generates a random boolean value.
 */
export class BooleanColumn<TRow> extends ColumnAbstract<TRow, boolean> {
  public getValue(): boolean {
    return generateRandomBoolean();
  }
}
