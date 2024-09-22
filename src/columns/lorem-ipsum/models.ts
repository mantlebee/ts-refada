import { getValue } from "@mantlebee/ts-core";

import { ColumnAbstract } from "@/models";

import { LoremIpsumColumnOptions } from "./types";
import { getLoremIpsumColumnValue } from "./utils";

export class LoremIpsumColumn<TRow> extends ColumnAbstract<
  TRow,
  string,
  LoremIpsumColumnOptions
> {
  public getValue(row: TRow): string {
    const options = getValue(this.options, row);
    return getLoremIpsumColumnValue(options);
  }
}
