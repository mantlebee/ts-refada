import { isNumber } from "@mantlebee/ts-core";
import { generateRandomNumber } from "@mantlebee/ts-random";

import { NumberOrRange } from "./types";

/**
 * Capitalizes the first letter of a text.
 * @param text Text to capitalize the first letter.
 * @returns the given text, with the first letter capitalized.
 */
export function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Returns the option as number. If it is a range, a random number from that range.
 * @param numberOrRange The option to return, that can be a number or an object, defining a range.
 * @returns the option as number. If it is a range, a random number from that range.
 */
export function getNumberFromRange(numberOrRange: NumberOrRange): number {
  if (isNumber(numberOrRange)) return numberOrRange as number;
  const { max, min } = numberOrRange as { max: number; min: number };
  return generateRandomNumber(max, min);
}
