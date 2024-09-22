import { getValue } from "@mantlebee/ts-core";

import { ColumnAbstract } from "@/models";

import { EmailColumnOptions } from "./types";
import { getEmailColumnValue } from "./utils";

/**
 * Generates a random email with first name, last name and two-levels domain, e.g. "john.doe@outlook.com".
 * It is possible to restrict the choice of these three parameters, using the options.
 * The random email format is "[first-name].[last-name]@[domain]".
 */
export class EmailColumn<TRow> extends ColumnAbstract<
  TRow,
  string,
  EmailColumnOptions
> {
  public getValue(row: TRow): string {
    const options = getValue(this.options, row);
    return getEmailColumnValue(options);
  }
}
