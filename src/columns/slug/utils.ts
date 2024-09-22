import { createSlug } from "@mantlebee/ts-core";

import { SlugColumnOptions } from "./types";

/**
 * Convert a value of the row into a slug.
 * @param options Options withe the name of the field which value must be converted into a slug.
 * @returns a slug.
 */
export function getSlugColumnValue<TRow>(
  row: TRow,
  options: SlugColumnOptions<TRow>
): string {
  const sourceValue = row[options.sourceField];
  return createSlug(`${sourceValue}`);
}
