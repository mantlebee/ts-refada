import {
  getLowercaseChars,
  getNumberChars,
  getSpecialChars,
  getUppercaseChars,
} from "@mantlebee/ts-core";
import { generateRandomStringFromChars } from "@mantlebee/ts-random";

import { getNumberFromRange } from "@/support";

import { StringColumnOptions } from "./types";

/**
 * Generates a random string.
 * It is possible to restrict the min and max length, and which symbols must be included.
 * To generate the string, uses the {@link generateRandomStringFromChars} method from the `@mantlebee/ts-random` package.
 * @param options Options to restrict string length and which symbols must be included.
 * @returns a random string.
 */
export function getStringColumnValue(options: StringColumnOptions): string {
  const {
    allow = {
      lowercase: true,
      numbers: true,
      special: true,
      uppercase: true,
      whitespace: true,
    },
  } = options;
  const length = getNumberFromRange(options.length);
  let chars: string = "";
  if (allow.lowercase) chars += getLowercaseChars();
  if (allow.numbers) chars += getNumberChars();
  if (allow.special) chars += getSpecialChars();
  if (allow.uppercase) chars += getUppercaseChars();
  if (allow.whitespace) chars += " ";
  return generateRandomStringFromChars(chars, length);
}
