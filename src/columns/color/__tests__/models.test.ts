import { ColorColumn } from "../models";

type RowTest = {
  name: string;
};

describe("ColorColumn", () => {
  describe("models", () => {
    describe("ColorColumn", () => {
      it("Generates a random IColor instance", () => {
        const column = new ColorColumn<RowTest>("name");
        const value = column.getValue({} as RowTest);
        const rgba = value.rgba();
        expect(rgba).toMatch(
          /^rgba\([0-9]{1,3},[0-9]{1,3},[0-9]{1,3},[0-9]\)$$/
        );
      });
    });
  });
});
