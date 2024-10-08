import { getValue } from "@mantlebee/ts-core";

import { ColumnAbstract } from "@/models";

import { TitleColumnOptions } from "./types";
import { getTitleColumnValue } from "./utils";

/**
 * Generates a random title, using words exctracted from a list of words.
 * Title comes with the first letter uppercase, or with all first letter uppercase.
 * A max length can be defined. The actual title length may be less than the max length.
 */
export class TitleColumn<TRow> extends ColumnAbstract<
  TRow,
  string,
  TitleColumnOptions
> {
  public getValue(row: TRow): string {
    const options = getValue(this.options, row);
    return getTitleColumnValue(options);
  }
}
