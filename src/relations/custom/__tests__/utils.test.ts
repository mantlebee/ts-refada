import { List } from "@mantlebee/ts-core";

import { RelationCustomValueGetter } from "../types";
import { setRelationCustomValues } from "../utils";

describe("RelationCustom", () => {
  describe("utils", () => {
    describe("setRelationCustomValues", () => {
      it("Set the value resulting from the delegate", () => {
        type To = { email: string };
        type From = { emailsWithCCount: number };
        const contacts: List<To> = [
          { email: "x.y@z" },
          { email: "a.b@c" },
          { email: "d.j@u" },
          { email: "f.k@x" },
        ];
        const people: List<From> = [
          { emailsWithCCount: -1 },
          { emailsWithCCount: -1 },
        ];
        const delegate: RelationCustomValueGetter<From, To, number> = (s, t) =>
          t.filter((a) => /x/.test(a.email)).length;
        setRelationCustomValues<From, To, number>(
          "emailsWithCCount",
          delegate,
          people,
          contacts,
          {}
        );
        people.forEach((a) => {
          expect(a.emailsWithCCount).toBe(2);
        });
      });
    });
  });
});
