import { List } from "@mantlebee/ts-core";

import { RelationCountCondition } from "../types";
import { setRelationCountValues } from "../utils";

describe("RelationCount", () => {
  describe("utils", () => {
    describe("setRelationCountValues", () => {
      it("Set the correct count.", () => {
        type Contact = { email: string; personId: number };
        type Person = { contactsCount: number; id: number };
        const contacts: List<Contact> = [
          { personId: 1, email: "x" },
          { personId: 1, email: "y" },
        ];
        const people: List<Person> = [
          { contactsCount: -1, id: 1 },
          { contactsCount: -1, id: 2 },
        ];
        const condition: RelationCountCondition<Person, Contact> = (s, t) =>
          t.personId === s.id;
        setRelationCountValues("contactsCount", condition, people, contacts);
        expect(people[0].contactsCount).toBe(2);
        expect(people[1].contactsCount).toBe(0);
      });
    });
  });
});
