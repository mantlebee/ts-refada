import {
  Any,
  Color,
  Dictionary,
  isBoolean,
  isDate,
  isEmail,
  isNumber,
  isString,
  List,
  Nullable,
  objectHasKey,
} from "@mantlebee/ts-core";

import {
  BooleanColumn,
  ColorColumn,
  CustomColumn,
  DateColumn,
  EmailColumn,
  EnumColumn,
  FirstNameColumn,
  IdColumn,
  LastNameColumn,
  LoremIpsumColumn,
  NumberColumn,
  PatternColumn,
  SlugColumn,
  StringColumn,
  TitleColumn,
} from "@/columns";
import { ITable } from "@/interfaces";
import {
  CountRelationColumn,
  CustomRelationColumn,
  LookupRelationColumn,
} from "@/relations";
import {
  createTableKey,
  getDatabaseDataset,
  getDatasetRows,
  getTableRows,
  shouldBeNull,
} from "@/utils";

import { Table } from "../models";

const ordersKey = createTableKey<Order>("orders");
const orderProductsKey = createTableKey<OrderProduct>("order-products");
const productsKey = createTableKey<Product>("products");
const productCategoriesKey =
  createTableKey<ProductCategory>("product-categories");

//#region Products
type Product = { categoryId: number; id: number; name: string };
const productsTable = new Table<Product>(productsKey, [
  new IdColumn("id"),
  new StringColumn("name", () => ({ length: 20 })),
  new LookupRelationColumn("categoryId", 0, productCategoriesKey, "id"),
]);
//#endregion

//#region Product Categories
type ProductCategory = { id: number; name: string };
const productCategoriesTable = new Table<ProductCategory>(
  productCategoriesKey,
  [new IdColumn("id"), new StringColumn("name", () => ({ length: 20 }))]
);
//#endregion

//#region Orders
type Order = {
  categoriesCount: number;
  id: number;
  productsCount: number;
};
const ordersTable = new Table<Order>(ordersKey, [
  new IdColumn("id"),
  new CustomRelationColumn(
    "categoriesCount",
    0,
    orderProductsKey,
    (order, orderProducts, dataset) => {
      // Product ids of the order
      const productsIds = orderProducts
        .filter((a) => a.orderId === order.id)
        .map((a) => a.productId);
      // Products of the order
      const products = dataset[productsKey];
      // Categories ids list (without duplicate values)
      const categoriesIds = new Set(
        products
          .filter((a) => productsIds.includes(a.id))
          .map((a) => a.categoryId)
      );
      // Count of the categories of the order
      return categoriesIds.size;
    }
  ),
  new CountRelationColumn(
    "productsCount",
    orderProductsKey,
    (o, p) => o.id === p.orderId
  ),
]);
//#endregion

//#region Order Products
type OrderProduct = { orderId: number; productId: number };
const orderProductsTable = new Table<OrderProduct>(orderProductsKey, [
  new LookupRelationColumn("orderId", 0, ordersKey, "id"),
  new LookupRelationColumn("productId", 0, productsKey, "id"),
]);
//#endregion

const tables: List<ITable<Any>> = [
  productCategoriesTable,
  productsTable,
  orderProductsTable,
  ordersTable,
];

describe("Table", () => {
  describe("utils", () => {
    describe("getDatabaseDataset", () => {
      it("Generates a map where the keys are the tables names and the values the generated rows.", () => {
        const rowsNumberMap: Dictionary<number> = {
          [productCategoriesKey]: 10,
          [productsKey]: 50,
          [orderProductsKey]: 5,
          [ordersKey]: 1,
        };
        const dataset = getDatabaseDataset(tables, rowsNumberMap);
        expect(Object.keys(dataset)).toHaveLength(4);
        const productCategories = getDatasetRows(dataset, productCategoriesKey);
        const products = getDatasetRows(dataset, productsKey);
        const orderProducts = getDatasetRows(dataset, orderProductsKey);
        const orders = getDatasetRows(dataset, ordersKey);
        const categoriesIds = productCategories.map((a) => a.id);
        products.forEach((a) => {
          expect(categoriesIds).toContain(a.categoryId);
        });
        const ordersIds = orders.map((a) => a.id);
        orderProducts.forEach((a) => {
          expect(ordersIds).toContain(a.orderId);
        });
        orders.forEach((a) => {
          expect(a.productsCount).toBe(
            orderProducts.filter((b) => b.orderId === a.id).length
          );
        });
      });
    });
    describe("getTableRows", () => {
      it("Generates 5 rows of {name: string}", () => {
        type Row = { name: string };
        const rows = getTableRows<Any>(
          [
            new StringColumn<Any>("name", () => ({
              length: 12,
              minLength: 4,
            })),
          ],
          5
        );
        expect(rows.length).toBe(5);
        expect(rows.every((a) => objectHasKey(a, "name"))).toBeTruthy();
        expect(
          rows.every((a) => a.name.length >= 4 && a.name.length <= 12)
        ).toBeTruthy();
      });
      it("Generates 100 rows of `{id: number, name: string, surname: string, fullname: string, age: Nullable<number>, email: string active: boolean, registered: Date, expires: Date, type: RowType, color: string, scoreMax: number; score: number, phone: string, username: string}`", () => {
        enum RowType {
          base,
          standard,
          advanced,
        }
        type Row = {
          id: number;
          name: string;
          surname: string;
          fullname: string;
          age: Nullable<number>;
          email: string;
          active: boolean;
          registered: Date;
          expires: Date;
          type: RowType;
          color: Color;
          scoreMax: number;
          score: number;
          phone: string;
          username: string;
          description: string;
          maxim: string;
          slug: string;
        };
        const rows = getTableRows<Any>(
          [
            new IdColumn<Any>("id"),
            new FirstNameColumn<Any>("name"),
            new LastNameColumn<Any>("surname"),
            new CustomColumn<Any, string>(
              "fullname",
              (a) => `${a.name} ${a.surname}`
            ),
            new NumberColumn<Any>("age", () => ({ max: 90, nullable: true })),
            new EmailColumn<Any>("email", (a) => ({
              firstNames: [a.name],
              lastNames: [a.surname],
            })),
            new BooleanColumn<Any>("active"),
            new DateColumn<Any>("registered"),
            new DateColumn<Any>("expires", (a) => ({ from: a.registered })),
            new EnumColumn<Any, RowType>("type", Object(RowType)),
            new ColorColumn<Any>("color"),
            new NumberColumn<Any>("scoreMax", () => ({ max: 100 })),
            new NumberColumn<Any>("score", (a) => ({ max: a.scoreMax })),
            new PatternColumn<Any>("phone", "+000-00000"),
            new PatternColumn<Any>("username", "a{8,12}"),
            new LoremIpsumColumn("description", () => ({
              nullable: true,
              paragraphs: { max: 5, min: 5 },
            })),
            new TitleColumn("maxim", { maxLength: 20 }),
            new SlugColumn("slug", { sourceField: "fullname" }),
          ],
          100
        );
        expect(rows.length).toBe(100);
        let lastRow: Nullable<Any> = null;
        rows.forEach((a) => {
          if (lastRow) expect(a.id).toBe(lastRow.id + 1);
          expect(isNumber(a.id)).toBeTruthy();
          expect(isString(a.name)).toBeTruthy();
          expect(isString(a.surname)).toBeTruthy();
          expect(isString(a.fullname)).toBeTruthy();
          expect(a.fullname).toBe(`${a.name} ${a.surname}`);
          expect(isEmail(a.email)).toBeTruthy();
          expect(
            a.email.indexOf(
              `${a.name.toLowerCase()}.${a.surname.toLowerCase()}`
            )
          ).toBe(0);
          expect(isBoolean(a.active)).toBeTruthy();
          expect(isDate(a.registered)).toBeTruthy();
          expect(isDate(a.expires)).toBeTruthy();
          expect(a.expires.getTime()).toBeGreaterThanOrEqual(
            a.registered.getTime()
          );
          expect(a.type in RowType).toBeTruthy();
          expect(a.color.rgba()).toMatch(
            /^rgba\([0-9]{1,3},[0-9]{1,3},[0-9]{1,3},[0-9]\)$$/
          );
          expect(isNumber(a.scoreMax)).toBeTruthy();
          expect(isNumber(a.score)).toBeTruthy();
          expect(a.score).toBeLessThanOrEqual(a.scoreMax);
          expect(isString(a.phone)).toBeTruthy();
          expect(a.phone).toMatch(/^\+[0-9]{3}-[0-9]{5}$/);
          expect(isString(a.username)).toBeTruthy();
          expect(a.username).toMatch(/^[a-z]{8,12}$/);
          expect(a.maxim.length).toBeLessThanOrEqual(20);
          expect(a.slug).toBe(
            a.fullname
              .toLowerCase()
              .replace(" ", "-")
              .replace(/[^\w-]+/g, "")
          );
          expect(Object.keys(a)).toEqual([
            "id",
            "name",
            "surname",
            "fullname",
            "age",
            "email",
            "active",
            "registered",
            "expires",
            "type",
            "color",
            "scoreMax",
            "score",
            "phone",
            "username",
            "description",
            "maxim",
            "slug",
          ]);
          lastRow = a;
        });
        // Nullable columns
        expect(rows.some((a) => isNumber(a.age))).toBeTruthy();
        expect(rows.some((a) => a.age === null)).toBeTruthy();
        expect(rows.some((a) => isString(a.description))).toBeTruthy();
        expect(rows.some((a) => a.description === null)).toBeTruthy();
        rows
          .filter((a) => a.description)
          .forEach((a) => {
            expect(a.description.split("\n\n")).toHaveLength(5);
          });
      });
    });
    describe("shouldBeNull", () => {
      it("false, if nullable is undefined, false, or 0", () => {
        expect(shouldBeNull(new IdColumn(""), {})).toBeFalsy();
        expect(shouldBeNull(new IdColumn(""), { nullable: 0 })).toBeFalsy();
        expect(shouldBeNull(new IdColumn(""), { nullable: false })).toBeFalsy();
      });
      it("false, if column is a nullable relation column, ignoring the nullable probability", () => {
        const relationColumn = new CountRelationColumn(
          "",
          createTableKey(""),
          () => true
        );
        expect(shouldBeNull(relationColumn, { nullable: true })).toBeTruthy();
        expect(shouldBeNull(relationColumn, { nullable: 1 })).toBeTruthy();
      });
      it("true in most case, because nullable is an high probability percentage", () => {
        const probability = 80;
        let falseCount = 0;
        let trueCount = 0;
        for (let i = 0; i < 100; i++) {
          const value = shouldBeNull(new IdColumn(""), {
            nullable: probability,
          });
          if (value) trueCount++;
          else falseCount++;
        }
        const delta = 10;
        expect(falseCount).toBeLessThanOrEqual(100 - probability + delta);
        expect(trueCount).toBeGreaterThanOrEqual(probability - delta);
      });
    });
  });
});
