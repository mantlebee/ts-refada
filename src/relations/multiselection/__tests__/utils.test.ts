import { List } from "@mantlebee/ts-core";

import { setRelationMultiselectionValues } from "../utils";

describe("RelationMultiselection", () => {
  describe("utils", () => {
    describe("setRelationMultiselectionValues", () => {
      it("Correct count", () => {
        type Target = { id: number };
        type Source = { targetIds: List<number> };
        const targetRows: List<Target> = [
          { id: 1 },
          { id: 2 },
          { id: 3 },
          { id: 4 },
          { id: 5 },
        ];
        const sourceRows: List<Source> = [
          { targetIds: [] },
          { targetIds: [] },
          { targetIds: [] },
        ];
        setRelationMultiselectionValues<Source, Target>(
          "targetIds",
          "id",
          sourceRows,
          targetRows
        );
        sourceRows.forEach((a) => {
          expect(a.targetIds.length).toBeLessThanOrEqual(targetRows.length);
        });
      });
    });
  });
});
