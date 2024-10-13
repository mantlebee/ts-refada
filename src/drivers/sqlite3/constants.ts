import { ValueConverter } from "./types";

/**
 * Default Sqlite3 value converter.
 * Adds quotes at the beginning and the end of the value.
 * @param value Value to convert.
 * @returns the value with quotes at the beginning and the end.
 */
export const ValueConverterDefault: ValueConverter = (value) =>
  /^".*"$/.test(value) ? value : `"${value}"`;
