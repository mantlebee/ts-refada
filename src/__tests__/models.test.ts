import { Any, List } from "@mantlebee/ts-core";

import { ConstantColumn, IdColumn } from "@/columns";
import { Database, Table, TableDetail } from "@/models";
import { LookupRelationColumn } from "@/relations";
import { createTableKey } from "@/utils";

type Category = { id: number; name: string };
type Product = { id: number; name: string; category: number };
const categoriesTableKey = createTableKey<Category>("categories");
const productsTableKey = createTableKey<Product>("products");

describe("models", () => {
  describe("Database", () => {
    const categoriesTable = new Table<Category>(categoriesTableKey, [
      new IdColumn("id"),
    ]);
    const productsTable = new Table<Product>(productsTableKey, [
      new IdColumn("id"),
      new LookupRelationColumn("category", 0, categoriesTableKey, "id"),
    ]);
    const productsTableDetail = new TableDetail(
      productsTableKey,
      categoriesTableKey,
      (a) => [new IdColumn("id"), new ConstantColumn("category", a.id)]
    );
    const tables: List<Table<Any>> = [productsTable, categoriesTable];
    it("generates a dataset with specific amount of rows for each table", () => {
      const dataset = new Database(tables)
        .seed({
          [categoriesTableKey]: 5,
          [productsTableKey]: 20,
        })
        .getDataset();
      expect(dataset[categoriesTableKey]).toHaveLength(5);
      expect(dataset[productsTableKey]).toHaveLength(20);
    });
    it("generates 0 rows for a table not defined in the countsMap", () => {
      const dataset = new Database(tables)
        .seed({ [categoriesTableKey]: 5 })
        .getDataset();
      expect(dataset[productsTableKey]).toHaveLength(0);
    });
    it("updates the relation columns values if there are relation columns", () => {
      const dataset = new Database(tables)
        .seed({
          [categoriesTableKey]: { max: 5, min: 2 },
          [productsTableKey]: 20,
        })
        .getDataset();
      expect(
        dataset[productsTableKey].every((a) => a.category !== 0)
      ).toBeTruthy();
    });
    describe("detail tables", () => {
      it("detail tables' rows count is the rows count of the detail table multiplied the rows count of its master table", () => {
        const dataset = new Database([categoriesTable, productsTableDetail])
          .seed({ [productsTableKey]: 2, [categoriesTableKey]: 5 })
          .getDataset();
        expect(dataset[productsTableKey]).toHaveLength(10);
      });
      it("detail tables' rows are cleared on every seed", () => {
        const database = new Database([categoriesTable, productsTableDetail]);
        const dataset1 = database
          .seed({ [productsTableKey]: 1, [categoriesTableKey]: 2 })
          .getDataset();
        expect(dataset1[productsTableKey]).toHaveLength(2);
        const dataset2 = database
          .seed({ [productsTableKey]: 1, [categoriesTableKey]: 4 })
          .getDataset();
        expect(dataset2[productsTableKey]).toHaveLength(4);
      });
    });
  });
  describe("Table", () => {
    it("has no rows, on create", () => {
      const rows = new Table(productsTableKey, [new IdColumn("id")]).getRows();
      expect(rows).toHaveLength(0);
    });
    it("generates a specific amount of rows", () => {
      const rows = new Table(productsTableKey, [new IdColumn("id")])
        .seed(42)
        .getRows();
      expect(rows).toHaveLength(42);
    });
  });
  describe("TableDetail", () => {
    it("has no columns, on create", () => {
      const { columns } = new TableDetail(
        productsTableKey,
        categoriesTableKey,
        () => [new IdColumn("id")]
      );
      expect(columns).toHaveLength(0);
    });
    it("generated rows can depend on the master row", () => {
      const categories: List<Category> = [
        { id: 21, name: "" },
        { id: 42, name: "" },
        { id: 84, name: "" },
      ];
      const detailTable = new TableDetail(
        productsTableKey,
        categoriesTableKey,
        (a) => [new IdColumn("id"), new ConstantColumn("category", a.id)]
      );
      categories.forEach((a) => detailTable.setMasterRow(a).seed(1));
      expect(detailTable.getRows().map((a) => a.category)).toEqual([
        21, 42, 84,
      ]);
    });
  });
});
