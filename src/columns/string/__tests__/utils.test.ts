import { getStringColumnValue } from "../utils";

describe("StringColumn", () => {
  describe("utils", () => {
    describe("getStringColumnValue", () => {
      it("Generates a random string up to 10 chars", () => {
        const random = getStringColumnValue({
          length: 10,
        });
        expect(/^.{0,10}$/.test(random)).toBeTruthy();
      });
      it("Generates 5 lowercase chars", () => {
        const random = getStringColumnValue({
          include: { lowercase: true },
          length: 5,
        });
        expect(/^[a-z]{5}$/.test(random)).toBeTruthy();
      });
      it("Generates a lowercase and uppercase string of length between 10 and 12 chars", () => {
        const random = getStringColumnValue({
          include: { lowercase: true, uppercase: true },
          length: { max: 12, min: 10 },
        });
        expect(/^([a-z]|[A-Z]){10,12}$/.test(random)).toBeTruthy();
      });
      it("Generates a string of 5 chars, without lowercase chars and special chars", () => {
        const random = getStringColumnValue({
          exclude: { lowercase: true, special: true },
          length: 5,
        });
        expect(/^[A-Z0-9 ]{5}$/.test(random)).toBeTruthy();
      });
    });
  });
});
