import { ColumnAbstract } from "@/models";

import { getLastNameColumnValue } from "./utils";

/**
 * Generates a random american last name.
 */
export class LastNameColumn<TRow> extends ColumnAbstract<TRow, string> {
  public getValue(row: TRow): string {
    return getLastNameColumnValue();
  }
}
