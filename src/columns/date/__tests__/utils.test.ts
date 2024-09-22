import { getDateColumnValue } from "../utils";

const firstDate = new Date(1970, 0, 1, 0, 0, 0);

describe("DateColumn", () => {
  describe("utils", () => {
    describe("getDateColumnValue", () => {
      it("Generates a random date", () => {
        const random = getDateColumnValue();
        expect(random.getTime()).toBeGreaterThanOrEqual(firstDate.getTime());
        expect(random.getTime()).toBeLessThanOrEqual(Date.now());
      });
    });
  });
});
