import { extractRandomItem } from "@mantlebee/ts-random";

import { LastNames } from "@/constants";

/**
 * Generates a random american last name.
 */
export function getLastNameColumnValue(): string {
  return extractRandomItem(LastNames);
}
