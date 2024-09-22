import { List } from "@mantlebee/ts-core";

import { IdColumn } from "@/columns";
import { Database, Table } from "@/models";
import { createTableKey } from "@/utils";

import { LookupRelationColumn } from "../models";
import { getTargetRowInfo, setRelationLookupValues } from "../utils";

describe("RelationLookup", () => {
  describe("utils", () => {
    describe("getTargetRowInfo", () => {
      it("Returns target row label, if finds target table and row", () => {
        type Source = { targetId: number };
        type Target = { id: number };
        const targetTable = new Table<Target>(
          createTableKey("target"),
          [new IdColumn("id")],
          (a) => `-${a.id}-`
        ).seed(5);
        const database = new Database([targetTable]);
        const sourceColumn = new LookupRelationColumn<Source, Target>(
          "targetId",
          0,
          targetTable.key,
          "id"
        );
        expect(
          getTargetRowInfo<Source, Target>(
            sourceColumn,
            { targetId: 1 },
            database
          )?.label
        ).toBe("-1-");
        expect(
          getTargetRowInfo<Source, Target>(
            sourceColumn,
            { targetId: 5 },
            database
          )?.label
        ).toBe("-5-");
      });
    });
    describe("setRelationLookupValues", () => {
      it("Correct count", () => {
        type Detail = { personId: number };
        type Master = { id: number };
        const detailRows: List<Detail> = [
          { personId: -1 },
          { personId: -1 },
          { personId: -1 },
          { personId: -1 },
          { personId: -1 },
        ];
        const masterRows: List<Master> = [{ id: 1 }, { id: 2 }, { id: 3 }];
        setRelationLookupValues<Detail, Master>(
          "personId",
          "id",
          detailRows,
          masterRows
        );
        detailRows.forEach((a) => {
          expect(a.personId).toBeGreaterThanOrEqual(1);
          expect(a.personId).toBeLessThanOrEqual(3);
        });
      });
    });
  });
});
