import { getLowercaseChars } from "@mantlebee/ts-core";

import { EssayBuilder } from "../models";

describe("LoremIpsumColumn", () => {
  describe("EssayBuilder", () => {
    describe("models", () => {
      describe("EssayBuilder", () => {
        it("Generates a text with one word only: 'miao'", () => {
          const builder = new EssayBuilder({
            paragraphs: 1,
            sentencesPerParagraph: 1,
            wordsPerSentence: 1,
          });
          while (!builder.complete) {
            builder.addWord("miao");
          }
          expect(builder.toString()).toEqual(`Miao`);
        });
        it("Generates a text with 2 paragraphs, 3 sentences per paragrah, 4 words per sentence, but all words are 'miao'", () => {
          const builder = new EssayBuilder({
            paragraphs: { min: 2, max: 2 },
            sentencesPerParagraph: { min: 3, max: 3 },
            wordsPerSentence: { min: 4, max: 4 },
          });
          while (!builder.complete) {
            builder.addWord("miao");
          }
          expect(builder.toString())
            .toEqual(`Miao miao miao miao. Miao miao miao miao. Miao miao miao miao.

Miao miao miao miao. Miao miao miao miao. Miao miao miao miao.`);
        });
        it("Generates a text with 3 paragraphs, 3 sentences per paragrah, 3 words per sentence. Words are consecutive alphabet letters plus an exclamation mark at the end", () => {
          const builder = new EssayBuilder({
            paragraphs: 3,
            sentencesPerParagraph: 3,
            wordsPerSentence: 3,
          });
          const chars = getLowercaseChars() + "!";
          let index = 0;
          while (!builder.complete) {
            builder.addWord(chars[index]);
            ++index;
          }
          expect(builder.toString()).toEqual(
            `A b c. D e f. G h i.

J k l. M n o. P q r.

S t u. V w x. Y z !.`
          );
        });
      });
    });
  });
});
