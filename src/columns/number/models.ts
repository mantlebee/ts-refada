import { getValue } from "@mantlebee/ts-core";

import { ColumnAbstract } from "@/models";

import { NumberColumnOptions } from "./types";
import { getNumberColumnValue } from "./utils";

/**
 * Generates a random number.
 * It is possible to specify min and max values, and the amount of decimals.
 */
export class NumberColumn<TRow> extends ColumnAbstract<
  TRow,
  number,
  NumberColumnOptions
> {
  public getValue(row: TRow): number {
    const options = getValue(this.options, row);
    return getNumberColumnValue(options);
  }
}
