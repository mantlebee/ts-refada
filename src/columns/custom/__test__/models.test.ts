import { CustomColumn } from "../models";

type RowTest = {
  name: string;
};

describe("CustomColumn", () => {
  describe("models", () => {
    describe("CustomColumn", () => {
      it("Generates a custom value using a delegate", () => {
        const delegate = jest.fn(() => "value");
        const column = new CustomColumn<RowTest, string>("name", delegate);
        const row = {} as RowTest;
        const value = column.getValue(row);
        expect(delegate).toBeCalledWith(row);
        expect(value).toBe("value");
      });
    });
  });
});
