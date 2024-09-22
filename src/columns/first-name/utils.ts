import { extractRandomItem } from "@mantlebee/ts-random";

import { FemaleFirstNames, Gender, MaleFirstNames } from "@/constants";

import { FirstNameColumnOptions } from "./types";
import { FirstNameColumnOptionsDefault } from "./constants";

/**
 * Generates a random male or female american first name.
 * It is possible to restrict the gender of the name to generate, using the options.
 * @param options Options to restrict the gender of the name, or not.
 * @returns a random male or female american first name.
 */
export function getFirstNameColumnValue(
  options?: FirstNameColumnOptions
): string {
  const { gender } = { ...FirstNameColumnOptionsDefault, ...options };
  switch (gender) {
    case Gender.female:
      return extractRandomItem(FemaleFirstNames);
    case Gender.male:
      return extractRandomItem(MaleFirstNames);
    case Gender.unspecified:
    default:
      const firstNames = extractRandomItem([MaleFirstNames, FemaleFirstNames]);
      return extractRandomItem(firstNames);
  }
}
