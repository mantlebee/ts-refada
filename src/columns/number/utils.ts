import { generateRandomNumber } from "@mantlebee/ts-random";

import { NumberColumnOptions } from "./types";

/**
 * Generates a random number.
 * It is possible to specify min and max values, and the amount of decimals.
 * @param options Options to restrict min, max, and decimals
 * @returns a random number.
 */
export function getNumberColumnValue(options?: NumberColumnOptions): number {
  let { decimals, max = 100, min } = { ...options };
  return generateRandomNumber(max, min, decimals);
}
