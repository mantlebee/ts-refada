import { getValue } from "@mantlebee/ts-core";

import { ColumnAbstract } from "@/models";

import { FirstNameColumnOptions } from "./types";
import { getFirstNameColumnValue } from "./utils";

/**
 * Generates a random male or female american first name.
 * It is possible to restrict the gender of the name to generate, using the options.
 */
export class FirstNameColumn<TRow> extends ColumnAbstract<
  TRow,
  string,
  FirstNameColumnOptions
> {
  public getValue(row: TRow): string {
    const options = getValue(this.options, row);
    return getFirstNameColumnValue(options);
  }
}
