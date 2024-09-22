import { PatternColumn } from "../models";

type RowTest = {
  name: string;
};

describe("PatternColumn", () => {
  describe("models", () => {
    describe("PatternColumn", () => {
      it("Generates a phone number compliant to +000-00000", () => {
        const patternColumn = new PatternColumn<RowTest>("name", "+000-00000");
        const value = patternColumn.getValue();
        expect(value).toMatch(/^\+[0-9]{3}-[0-9]{5}$/);
      });
    });
  });
});
