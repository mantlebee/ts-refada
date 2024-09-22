import { EmailColumn } from "../models";

type RowTest = {
  domain: string;
  firstName: string;
  lastName: string;
};

const row: RowTest = {
  domain: "gmail.com",
  firstName: "John",
  lastName: "Doe",
};

describe("EmailColumn", () => {
  describe("models", () => {
    describe("EmailColumn", () => {
      it("Generates a random email, taking domain, firstName and lastname from the passed row", () => {
        const dependantColumn = new EmailColumn<RowTest>("domain", (a) => ({
          domains: [a.domain],
          firstNames: [a.firstName],
          lastNames: [a.lastName],
        }));
        const random = dependantColumn.getValue(row);
        expect(random).toBe("john.doe@gmail.com");
      });
    });
  });
});
