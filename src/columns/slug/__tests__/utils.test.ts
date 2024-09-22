import { getSlugColumnValue } from "../utils";

describe("SlugColumn", () => {
  describe("utils", () => {
    describe("getSlugColumnValue", () => {
      it("Convert a field of the row into a slug. The field is defined in the options.", () => {
        type Row = { name: string };
        const slug = getSlugColumnValue<Row>(
          { name: "I'm the best ! The #1" },
          { sourceField: "name" }
        );
        expect(slug).toBe("im-the-best--the-1");
      });
    });
  });
});
