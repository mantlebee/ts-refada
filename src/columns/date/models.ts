import { getValue } from "@mantlebee/ts-core";

import { ColumnAbstract } from "@/models";

import { DateColumnOptions } from "./types";
import { getDateColumnValue } from "./utils";

/**
 * Generates a random date.
 * It is possible to restrict the range of date and time, through the column options.
 */
export class DateColumn<TRow> extends ColumnAbstract<
  TRow,
  Date,
  DateColumnOptions
> {
  public getValue(row: TRow): Date {
    const options = getValue(this.options, row);
    return getDateColumnValue(options);
  }
}
