import { getValue } from "@mantlebee/ts-core";

import { ColumnAbstract } from "@/models";

import { StringColumnOptions } from "./types";
import { getStringColumnValue } from "./utils";

/**
 * Generates a random string.
 * It is possible to restrict the min and max length, and which symbols must be included.
 */
export class StringColumn<TRow> extends ColumnAbstract<
  TRow,
  string,
  StringColumnOptions
> {
  public getValue(row: TRow): string {
    const options = getValue(this.options, row);
    return getStringColumnValue(options);
  }
}
