import { getValue, IColor } from "@mantlebee/ts-core";
import { generateRandomColor } from "@mantlebee/ts-random";

import { ColumnAbstract } from "@/models";

import { ColorColumnOptions } from "./types";

/**
 * Generates a random `IColor` instance.
 * It is possible restrict the color generation giving a range defined by options `from` and `to`.
 * It is possible to choose if the color could be partially transparent, using the `transparent` option. In this case, the opacity level is generated randomly.
 */
export class ColorColumn<TRow> extends ColumnAbstract<
  TRow,
  IColor,
  ColorColumnOptions
> {
  public getValue(row: TRow): IColor {
    const { from, to, transparent } = getValue(this.options, row);
    return generateRandomColor(transparent, from, to);
  }
}
