import { KeyOf, ValueOrGetter } from "@mantlebee/ts-core";

import { ColumnAbstract } from "@/models";
import { ColumnOptions } from "@/types";

/**
 * Returns a constant value
 */
export class ConstantColumn<
  TRow,
  TValue,
  TOptions extends ColumnOptions = ColumnOptions,
> extends ColumnAbstract<TRow, TValue, TOptions> {
  public constructor(
    name: KeyOf<TRow>,
    private readonly value: TValue,
    options: ValueOrGetter<TOptions, TRow> = {} as TOptions
  ) {
    super(name, options);
  }

  public getValue(): TValue {
    return this.value;
  }
}
