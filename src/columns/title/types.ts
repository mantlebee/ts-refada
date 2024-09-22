import { List } from "@mantlebee/ts-core";

import { NumberOrRange } from "@/support";
import { ColumnOptions } from "@/types";

export type TitleColumnOptions = ColumnOptions & {
  capAllFirstLetters?: boolean;
  maxLength: NumberOrRange;
  words?: List<string>;
};
