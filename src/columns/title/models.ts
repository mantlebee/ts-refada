import { getValue } from "@mantlebee/ts-core";

import { ColumnAbstract } from "@/models";

import { TitleColumnOptions } from "./types";
import { getTitleColumnValue } from "./utils";

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
