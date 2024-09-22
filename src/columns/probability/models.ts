import { getValue } from "@mantlebee/ts-core";

import { ColumnAbstract } from "@/models";

import { ProbabilityColumnOptions } from "./types";
import { getProbabilityColumnValue } from "./utils";

/**
 * Extract a random value from the probability map ({@link ProbabilityValuesMap}), given as option.
 */
export class ProbabilityColumn<TRow, TValue> extends ColumnAbstract<
  TRow,
  TValue,
  ProbabilityColumnOptions<TValue>
> {
  public getValue(row: TRow): TValue {
    const options = getValue(this.options, row);
    return getProbabilityColumnValue(options);
  }
}
