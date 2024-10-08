import { getValue } from "@mantlebee/ts-core";

import { ColumnAbstract } from "@/models";

import { ProbabilityColumnOptions } from "./types";
import { getProbabilityColumnValue } from "./utils";

/**
 * Extract a random value from the probability map ({@link ProbabilityValuesMap}), given as option.
 * The {@link ProbabilityValuesMap} offers the opportunity to use 0 and 100 as percentage of probability,
 * to force some values to be completly avoided or chosen, using other values of the generated row as reference.
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
