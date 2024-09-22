import { getProbabilityColumnValue } from "../utils";

describe("ProbabilityColumn", () => {
  describe("utils", () => {
    describe("getProbabilityColumnValue", () => {
      it("Extract a random value from a probability values map. More a value has a higher probability, more is possible it is extracted from the map.", () => {
        const falseProbability = 20;
        const trueProbability = 80;
        let falseCount = 0;
        let trueCount = 0;
        for (let i = 0; i < 100; i++) {
          const value = getProbabilityColumnValue({
            values: { [trueProbability]: true, [falseProbability]: false },
          });
          if (value) trueCount++;
          else falseCount++;
        }
        expect(trueCount).toBeGreaterThanOrEqual(falseProbability);
        expect(falseCount).toBeLessThanOrEqual(trueProbability);
      });
      it("If none of the values has been extracted because of unluck probability, the most probable is returned", () => {
        const value = getProbabilityColumnValue({
          values: { 1: "online", 0: "offline" },
        });
        expect(value).toContain("online");
      });
    });
  });
});
