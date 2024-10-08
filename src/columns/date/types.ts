import { ColumnOptions } from "@/types";

/**
 * {@link DateColumnOptions} date option.
 * For more control, `hours`, `minutes`, and `seconds` can be specified.
 */
export type DateColumnOption = {
  date: Date;
  hours?: number;
  minutes?: number;
  seconds?: number;
};

/**
 * {@link DateColumn} options.
 * `from` and `to` option can be a simple date or a more detailed configuration.
 * @prop `from` - Begin of a date range. If omitted the default is inherited by the `generateRandomDate` method of the `@mantlebee/ts-random` package.
 * @prop `to` - End of a date range. If omitted the default is inherited by the `generateRandomDate` method of the `@mantlebee/ts-random` package.
 */
export type DateColumnOptions = ColumnOptions & {
  from?: Date | DateColumnOption;
  to?: Date | DateColumnOption;
};
