import { getTitleColumnValue } from "../utils";

describe("TitleColumn", () => {
  describe("utils", () => {
    describe("getTitleColumnValue", () => {
      describe("Generates a title where all words are 'joe'", () => {
        const words = ["joe"];
        it("Only the first letter capitalized", () => {
          const title = getTitleColumnValue({ maxLength: 15, words });
          expect(title).toBe("Joe joe joe joe");
        });
        it("Title is truncated and trimmed to respect the max length", () => {
          const title = getTitleColumnValue({ maxLength: 10, words });
          expect(title).toBe("Joe joe");
        });
        it("with all the first letters capitalized", () => {
          const title = getTitleColumnValue({
            capAllFirstLetters: true,
            maxLength: 15,
            words,
          });
          expect(title).toBe("Joe Joe Joe Joe");
        });
      });
      describe("Generates a title, extracting random words from options", () => {
        const maxLength = { max: 20, min: 10 };
        const words = ["foo", "bar", "john", "doe"];
        it("Only the first letters capitalized", () => {
          const title = getTitleColumnValue({ maxLength, words });
          expect(
            /^[(F|f)oo|(B|b)ar|(J|j)ohn|(D|d)oe| ]{1,20}$/.test(title)
          ).toBeTruthy();
        });
        it("Generates a title, extracting random words from options, with all the first letters capitalized", () => {
          const title = getTitleColumnValue({
            capAllFirstLetters: true,
            maxLength,
            words,
          });
          expect(/^[Foo|Bar|John|Doe| ]{1,20}$/.test(title)).toBeTruthy();
        });
      });
    });
  });
});
