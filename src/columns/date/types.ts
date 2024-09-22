import { ColumnOptions } from "@/types";

/**
 * {@link DateColumnOptions} date option.
 * `from` and `to` option can be a simple date or a more detailed configuration,
 * where also `hours`, `minutes`, and `seconds` are specified.
 */
export type DateColumnOption = {
  date: Date;
  hours?: number;
  minutes?: number;
  seconds?: number;
};

/**
 * {@link DateColumn} options.
 * @prop `dateFrom` - Begin of a date range. If omitted the default is inherited by the `generateRandomDate` method from `@mantlebee/ts-random` package.
 * @prop `dateTo` - End of a date range. If omitted the default is inherited by the `generateRandomDate` method from `@mantlebee/ts-random` package.
 */
export type DateColumnOptions = ColumnOptions & {
  from?: Date | DateColumnOption;
  to?: Date | DateColumnOption;
};
