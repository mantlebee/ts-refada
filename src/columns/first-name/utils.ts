import { extractRandomItem } from "@mantlebee/ts-random";

import { FemaleFirstNames, Gender, MaleFirstNames } from "@/constants";

import { FirstNameColumnOptions } from "./types";

/**
 * Generates a random male or female american first name.
 * It is possible to restrict the gender of the name to generate, using the options.
 * @param options Options to restrict the gender of the name, or not.
 * @returns a random male or female american first name.
 */
export function getFirstNameColumnValue(
  options?: FirstNameColumnOptions
): string {
  if (options) {
    const { gender } = options;
    switch (gender) {
      case Gender.female:
        return extractRandomItem(FemaleFirstNames);
      case Gender.male:
        return extractRandomItem(MaleFirstNames);
    }
  }
  const firstNames = extractRandomItem([MaleFirstNames, FemaleFirstNames]);
  return extractRandomItem(firstNames);
}
