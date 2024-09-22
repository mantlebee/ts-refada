import { getLoremIpsumColumnValue } from "../utils";

describe("LoremIpsumColumn", () => {
  describe("utils", () => {
    describe("getLoremIpsumColumnValue", () => {
      it("Generates a lorem ipsum text", () => {
        const loremIpsum = getLoremIpsumColumnValue({
          paragraphs: { max: 2, min: 1 },
          sentencesPerParagraph: { max: 4, min: 3 },
          wordsPerSentence: { max: 6, min: 5 },
        });
        const paragraphs = loremIpsum.split("\n\n");
        expect(paragraphs.length).toBeGreaterThanOrEqual(1);
        expect(paragraphs.length).toBeLessThanOrEqual(2);
        paragraphs.forEach((paragraph) => {
          // Splitting by "." only, gives an empty string as last array value.
          const sentences = paragraph.split(". ");
          expect(sentences.length).toBeGreaterThanOrEqual(3);
          expect(sentences.length).toBeLessThanOrEqual(4);
          sentences.forEach((sentence) => {
            const words = sentence.split(" ");
            expect(words.length).toBeGreaterThanOrEqual(5);
            expect(words.length).toBeLessThanOrEqual(6);
          });
        });
      });
    });
  });
});
