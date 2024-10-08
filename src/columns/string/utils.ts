import {
  getLowercaseChars,
  getNumberChars,
  getSpecialChars,
  getUppercaseChars,
  KeyOf,
} from "@mantlebee/ts-core";
import { generateRandomStringFromChars } from "@mantlebee/ts-random";

import { getNumberFromRange } from "@/support";

import { StringColumnOptions, SymbolsOption } from "./types";

/**
 * Generates a random string.
 * It is possible to restrict the min and max length, and which symbols must be included or excluded.
 * To generate the string, uses the {@link generateRandomStringFromChars} method from the `@mantlebee/ts-random` package.
 * @param options Options to restrict string length and which symbols must be included or excluded.
 * @returns a random string.
 */
export function getStringColumnValue(options: StringColumnOptions): string {
  let allow: SymbolsOption = {
    lowercase: true,
    numbers: true,
    special: true,
    uppercase: true,
    whitespace: true,
  };
  if (options.include) allow = options.include;
  else if (options.exclude)
    Object.keys(options.exclude).forEach(
      (a) => (allow[a as KeyOf<SymbolsOption>] = false)
    );

  let chars: string = "";
  if (allow.lowercase) chars += getLowercaseChars();
  if (allow.numbers) chars += getNumberChars();
  if (allow.special) chars += getSpecialChars();
  if (allow.uppercase) chars += getUppercaseChars();
  if (allow.whitespace) chars += " ";

  const length = getNumberFromRange(options.length);
  return generateRandomStringFromChars(chars, length);
}
