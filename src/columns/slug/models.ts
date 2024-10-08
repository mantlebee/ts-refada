import { getValue } from "@mantlebee/ts-core";

import { ColumnAbstract } from "@/models";

import { SlugColumnOptions } from "./types";
import { getSlugColumnValue } from "./utils";

/**
 * Converts a string field value into a slug.
 */
export class SlugColumn<TRow> extends ColumnAbstract<
  TRow,
  string,
  SlugColumnOptions<TRow>
> {
  public getValue(row: TRow): string {
    const options = getValue(this.options, row);
    return getSlugColumnValue(row, options);
  }
}
