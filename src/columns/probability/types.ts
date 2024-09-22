import { ColumnOptions } from "@/types";

export type ProbabilityValuesMap<TValue> = Record<number, TValue>;

export type ProbabilityColumnOptions<TValue> = ColumnOptions & {
  values: ProbabilityValuesMap<TValue>;
};
