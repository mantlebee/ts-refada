import { IColor } from "@mantlebee/ts-core";

import { ColumnOptions } from "@/types";

/**
 * {@link ColorColumn} options.
 * @prop `from` - Begin of a color range. Default is `black`.
 * @prop `to` - End of a color range. Default is `white`.
 * @prop `transparent` - Defines if the color generated should be opaque or have a opacity level.
 */
export type ColorColumnOptions = ColumnOptions & {
  from?: IColor;
  to?: IColor;
  transparent?: boolean;
};
