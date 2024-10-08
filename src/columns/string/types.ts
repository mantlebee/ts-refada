import { NumberOrRange } from "@/support";
import { ColumnOptions } from "@/types";

/**
 * {@link StringColumn} options.
 * Allows to chose the `length` of the string and which symbols ({@link SymbolsOption}) must be included or excluded.
 * The `include` option takes priority over the `exclude` option.
 * @prop `exclude` - defines which symbols must be excluded.
 * @prop `include` - defines which symbols must be included.
 * @prop `length` - length of the string. It can be a specific number or a range.
 */
export type StringColumnOptions = ColumnOptions & {
  exclude?: SymbolsOption;
  include?: SymbolsOption;
  length: NumberOrRange;
};

export type SymbolsOption = {
  lowercase?: boolean;
  numbers?: boolean;
  special?: boolean;
  uppercase?: boolean;
  whitespace?: boolean;
};
