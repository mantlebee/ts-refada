import { extractRandomItem } from "@mantlebee/ts-random";

/**
 * Extract a random value from the passed enumerative.
 * To pass and enumerative, use the `Object(MyEnum)` syntax.
 */
export function getEnumColumnValue<TEnum>(enumerative: TEnum): TEnum {
  const keysAndValues = Object.keys(Object(enumerative));
  const keys = keysAndValues.splice(keysAndValues.length / 2);
  const randomKey = extractRandomItem(keys);
  return enumerative[randomKey as keyof TEnum] as unknown as TEnum;
}
