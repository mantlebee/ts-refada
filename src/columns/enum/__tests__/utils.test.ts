import { List } from "@mantlebee/ts-core";

import { getEnumColumnValue } from "../utils";

enum Enumerative {
  first,
  second,
  third,
}

describe("EnumColumn", () => {
  describe("utils", () => {
    describe("getEnumColumnValue", () => {
      it("Generates a random enumerative value", () => {
        const randoms: List<Enumerative> = [];
        for (let i = 0; i < 100; ++i)
          randoms.push(getEnumColumnValue(Object(Enumerative)));
        randoms.forEach((a) => {
          expect([0, 1, 2]).toContain(a);
        });
      });
    });
  });
});
