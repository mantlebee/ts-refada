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
      type Address = { id: number; userId: number };
      type Order = { id: number; userId: number; addressId: number };
      const addresses: List<Address> = [
        { id: 1, userId: 1 },
        { id: 2, userId: 1 },
        { id: 3, userId: 2 },
        { id: 4, userId: 2 },
      ];
      const orders: List<Order> = [
        { id: 1, userId: 1, addressId: 0 },
        { id: 2, userId: 1, addressId: 0 },
        { id: 3, userId: 2, addressId: 0 },
        { id: 4, userId: 2, addressId: 0 },
      ];
      it("Correct count", () => {
        setRelationLookupValues<Order, Address>(
          "addressId",
          "id",
          orders,
          addresses
        );
        orders.forEach((a) => {
          expect(a.addressId).toBeGreaterThanOrEqual(1);
          expect(a.addressId).toBeLessThanOrEqual(4);
        });
      });
      it("Some values are null, if column is nullable", () => {
        setRelationLookupValues<Order, Address>(
          "addressId",
          "id",
          orders,
          addresses,
          { nullable: true }
        );
        expect(orders.some((a) => a.addressId === null)).toBeTruthy();
      });
      it("Uses only filtered target rows, for setting source rows' values", () => {
        setRelationLookupValues<Order, Address>(
          "addressId",
          "id",
          orders,
          addresses,
          {
            filter: (addresses, order) => addresses.userId === order.userId,
          }
        );
        orders.forEach((order) => {
          expect(
            addresses.find((a) => a.id === order.addressId)?.userId ===
              order.userId
          ).toBeTruthy();
        });
      });
    });
  });
});
