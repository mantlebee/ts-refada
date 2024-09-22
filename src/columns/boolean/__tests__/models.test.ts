import { BooleanColumn } from "../models";

type RowTest = {
  active: boolean;
};

describe("BooleanColumn", () => {
  describe("models", () => {
    describe("BooleanColumn", () => {
      it("Generates a random boolean", () => {
        const column = new BooleanColumn<RowTest>("active");
        const value = column.getValue();
        expect([true, false]).toContain(value);
      });
    });
  });
});
