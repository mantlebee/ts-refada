import { List } from "@mantlebee/ts-core";
import { extractRandomItem } from "@mantlebee/ts-random";

import { capitalizeFirstLetter, getNumberFromRange } from "@/support";
import { LoremIpsumWords } from "@/constants";

import { TitleColumnOptions } from "./types";

export function getTitleColumnValue(options: TitleColumnOptions): string {
  let currentLength = 0;
  const maxLength = getNumberFromRange(options.maxLength);
  const chunks: List<string> = [];
  while (true) {
    let nextWord = extractRandomItem(options.words || LoremIpsumWords);
    if (currentLength + nextWord.length + chunks.length > maxLength) break;
    if (!chunks.length || options.capAllFirstLetters)
      nextWord = capitalizeFirstLetter(nextWord);
    chunks.push(nextWord);
    currentLength += nextWord.length;
  }
  return chunks.join(" ");
}
