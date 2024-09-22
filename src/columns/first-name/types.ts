import { Gender } from "@/constants";
import { ColumnOptions } from "@/types";

/**
 * {@link FirstNameColumn} options.
 * @prop `gender` - to specify a gender, or not.
 */
export type FirstNameColumnOptions = ColumnOptions & {
  gender?: Gender;
};
