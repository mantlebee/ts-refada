import { ColumnOptions } from "@/types";

/**
 * The probability values map defines the values from which to choose from,
 * and the percentage of probability for each value to occurs.
 * The key of the map is the percentage of probability to occurs (0-100),
 * while the value is the alue to extract.
 */
export type ProbabilityValuesMap<TValue> = Record<number, TValue>;

/**
 * {@link ProbabilityColumn} options.
 * @prop `values` - the probability values map from which to generate the random value.
 */
export type ProbabilityColumnOptions<TValue> = ColumnOptions & {
  values: ProbabilityValuesMap<TValue>;
};
