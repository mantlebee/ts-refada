import { KeyOf } from "@mantlebee/ts-core";

import { ColumnOptions } from "@/types";

/**
 * {@link SlugColumn} options.
 * @prop `sourceField` - the string field from which to take the value, and to convert into a slug.
 */
export type SlugColumnOptions<TRow> = ColumnOptions & {
  sourceField: KeyOf<TRow>;
};
