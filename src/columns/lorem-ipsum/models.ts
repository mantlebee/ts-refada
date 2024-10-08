import { getValue } from "@mantlebee/ts-core";

import { ColumnAbstract } from "@/models";

import { LoremIpsumColumnOptions } from "./types";
import { getLoremIpsumColumnValue } from "./utils";

/**
 * Generates a Lorem Ipsum essay.
 * The text generation can be configured, defining amount of
 * paragraphs, sentences per paragrah, and words per sentence.
 * The amount of each configuration can be a specific value or a range.
 */
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
