import { ValueConverter } from "./types";

export const ValueConverterDefault: ValueConverter = (a) =>
  /^".*"$/.test(a) ? a : `"${a}"`;
