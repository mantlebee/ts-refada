import { extractRandomItem } from "@mantlebee/ts-random";

import { EssayBuilder, EssayBuilderOptions } from "@/support";
import { LoremIpsumWords } from "@/constants";

import { OptionsDefault } from "./constants";
import { LoremIpsumColumnOptions } from "./types";

export function getLoremIpsumColumnValue(
  options: LoremIpsumColumnOptions
): string {
  const essayBuilderOptions: EssayBuilderOptions = {
    ...OptionsDefault,
    ...options,
  };
  const loremBuilder = new EssayBuilder(essayBuilderOptions);
  do {
    const word = extractRandomItem(LoremIpsumWords);
    loremBuilder.addWord(word);
  } while (!loremBuilder.complete);
  return loremBuilder.toString();
}
