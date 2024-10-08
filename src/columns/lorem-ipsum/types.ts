import { OptionalKeysOf } from "@mantlebee/ts-core";

import { EssayBuilderOptions } from "@/support";
import { ColumnOptions } from "@/types";

/**
 * {@link LoremIpsumColumn} options.
 * Inherits from {@link EssayBuilderOptions}.
 */
export type LoremIpsumColumnOptions = ColumnOptions &
  OptionalKeysOf<EssayBuilderOptions>;
