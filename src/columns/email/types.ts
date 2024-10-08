import { List } from "@mantlebee/ts-core";

import { ColumnOptions } from "@/types";

/**
 * {@link EmailColumn} options.
 * @prop `domains` - List of domains from which to choose.
 * @prop `firstNames` - List of first names from which to choose.
 * @prop `lastNames` - List of last names from which to choose.
 */
export type EmailColumnOptions = ColumnOptions & {
  domains?: List<string>;
  firstNames?: List<string>;
  lastNames?: List<string>;
};
