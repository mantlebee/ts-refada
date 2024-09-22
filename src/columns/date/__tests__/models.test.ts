import { DateColumn } from "../models";

type RowTest = {
  dateFrom: Date;
  dateTo: Date;
};

const row: RowTest = {
  dateFrom: new Date(2022, 4, 3, 0, 0, 0),
  dateTo: new Date(2022, 4, 3, 23, 59, 59),
};

describe("DateColumn", () => {
  describe("models", () => {
    describe("DateColumn", () => {
      it("Generates a random date, using startFrom e startTo from passed row", () => {
        const dependantColumn = new DateColumn<RowTest>("dateFrom", (a) => ({
          from: a.dateFrom,
          to: a.dateTo,
        }));
        const random = dependantColumn.getValue(row);
        expect(random.getTime()).toBeGreaterThanOrEqual(row.dateFrom.getTime());
        expect(random.getTime()).toBeLessThanOrEqual(row.dateTo.getTime());
      });
    });
  });
});
