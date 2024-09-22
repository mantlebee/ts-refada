import { Any, List, TypedKey } from "@mantlebee/ts-core";

import { ITable } from "./interfaces";
import { NumberOrRange } from "./support";

/**
 * Default column ({@link Column}) options.
 * @prop `nullable` - The column value can be casually `null`. The `nullable` option can be a boolean or a probability percentage (0-100).
 */
export type ColumnOptions = { nullable?: boolean | number };

/**
 * Database ({@link IDatabase}) dataset. It is a dictionary where the key is the table ({@link ITable}) key and the value the table rows generated.
 * Like the {@link Row} type, this type is defined to simplify return types.
 */
export type Dataset = Record<TableKey<Any> | string, List<Any>>;

/**
 * Define a map of table keys and the amount of rows to generate.
 * It is used by {@link Database} to know how many rows to generate for each table.
 */
export type RowsCountsMap = Record<TableKey<Any>, NumberOrRange>;

export type TableKey<TRow> = symbol &
  TypedKey<TRow> & { readonly description: string };
