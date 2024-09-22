import { EssayBuilderOptions } from "@/support";

export const OptionsDefault: EssayBuilderOptions = {
  paragraphs: { max: 5, min: 1 },
  sentencesPerParagraph: { max: 8, min: 4 },
  wordsPerSentence: { max: 16, min: 4 },
};
