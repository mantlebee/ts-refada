import { ColumnOptions } from "@/types";

/**
 * {@link NumberColumn} options.
 * @prop `decimals` - decimals.
 * @prop `max` - max value (included).
 * @prop `min` - min value, default is 0.
 */
export type NumberColumnOptions = ColumnOptions & {
  decimals?: number;
  max: number;
  min?: number;
};
