import { ConstantColumn } from "../models";

type RowTest = {
  category: string;
};

describe("ConstantColumn", () => {
  describe("models", () => {
    describe("ConstantColumn", () => {
      it("Returns always a constant value", () => {
        const column = new ConstantColumn<RowTest, string>(
          "category",
          "Food & Drinks"
        );
        const value = column.getValue();
        expect(value).toBe("Food & Drinks");
      });
    });
  });
});
