import { generateRandomNumber } from "@mantlebee/ts-random";

import { ProbabilityColumnOptions } from "./types";

/**
 * Extract a random value from the probability map ({@link ProbabilityValuesMap}).
 * @param options Options with the probability map of the values ({@link ProbabilityValuesMap}).
 * @returns a random value.
 */
export function getProbabilityColumnValue<TValue>(
  options: ProbabilityColumnOptions<TValue>
): TValue {
  let moreProbableValue: TValue;
  const probabilities = Object.keys(options.values).reverse();
  for (const [index, entry] of probabilities.entries()) {
    const probability = parseInt(entry);
    if (!probability) continue;
    const value = options.values[probability];
    if (!index) moreProbableValue = value;
    if (generateRandomNumber(100) <= probability) return value;
  }
  return moreProbableValue!;
}
