import { List } from "@mantlebee/ts-core";

import { NumberOrRange } from "@/support";
import { ColumnOptions } from "@/types";

/**
 * {@link TitleColumn} options.
 * @prop `capAllFirstLetters` - If capitalize only first letter or all first letters.
 * @prop `maxLength` - max length of the title. The actual title length may be less than the max length.
 * @prop `words` - list of words to use to generate the title. If not provided, the Lorem Ipsum words will be used.
 */
export type TitleColumnOptions = ColumnOptions & {
  capAllFirstLetters?: boolean;
  maxLength: NumberOrRange;
  words?: List<string>;
};
