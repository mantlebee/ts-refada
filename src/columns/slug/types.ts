import { KeyOf } from "@mantlebee/ts-core";

import { ColumnOptions } from "@/types";

export type SlugColumnOptions<TRow> = ColumnOptions & {
  sourceField: KeyOf<TRow>;
};
