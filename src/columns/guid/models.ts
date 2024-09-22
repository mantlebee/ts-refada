import { generateGuid } from "@mantlebee/ts-core";

import { ColumnAbstract } from "@/models";

/**
 * Generates a GUID.
 */
export class GuidColumn<TRow> extends ColumnAbstract<TRow, string> {
  public getValue(): string {
    return generateGuid();
  }
}
