import { CustomColumn, IdColumn } from "@/columns";
import { MultiselectionRelationColumn } from "@/relations";
import { ConstantTable, Table } from "@/tables";
import { createTableKey } from "@/utils";

import {
  createDeleteQuery,
  createInsertQuery,
  getDeleteQuery,
  getInsertQuery,
} from "../utils";
import { Any, List } from "@mantlebee/ts-core";
import { QueryRelation } from "@/drivers/types";
import { ITable } from "@/interfaces";

describe("drivers", () => {
  describe("sqlite3", () => {
    describe("query-builders", () => {
      // Constant
      const constantTable = new ConstantTable(
        createTableKey("ConstantTable"),
        []
      );

      // Source & Target
      type SourceRow = { id: number; name: string; targets: List<number> };
      type TargetRow = { id: number };
      const targetColumn = new IdColumn<TargetRow>("id");
      const targetTable = new Table<TargetRow>(createTableKey("TargetTable"), [
        targetColumn,
      ]);
      const targetRows: List<TargetRow> = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
      ];
      const sourceColumn = new MultiselectionRelationColumn<
        SourceRow,
        TargetRow
      >("targets", targetTable.key, "id");
      const sourceTable = new Table<SourceRow>(createTableKey("SourceTable"), [
        sourceColumn,
        new IdColumn("id"),
        new CustomColumn("name", (a) => `N${a.id}`),
      ]);
      const sourceRows: List<SourceRow> = [
        { id: 1, name: "'John'", targets: [1, 3] },
        { id: 2, name: "'Jane'", targets: [2, 4] },
      ];

      // Relations
      const relations: List<QueryRelation<SourceRow, TargetRow>> = [
        { sourceColumn, targetTable },
      ];
      const getRelationTableName = () =>
        sourceTable.name + "_to_" + targetTable.name;
      const getRelationRows = (
        relation: QueryRelation<SourceRow, TargetRow>,
        sourceRow: SourceRow
      ) =>
        targetRows
          .filter((targetRow) => sourceRow.targets.includes(targetRow.id))
          .map((targetRow) => {
            const fromName = sourceTable.name + "_id";
            const toName = targetTable.name + "_" + targetColumn.name;
            return {
              [fromName]: sourceRow.id,
              [toName]: targetRow[targetColumn.name],
            };
          });

      // Tests
      describe("utils", () => {
        describe("createDeleteQuery", () => {
          it("Returns empty query for constant tables", () => {
            const query = createDeleteQuery(constantTable, [], () => "");
            expect(query).toBe("");
          });
          it("Returns delete query for the table", () => {
            const query = createDeleteQuery(sourceTable, [], () => "");
            expect(query).toBe("DELETE FROM SourceTable;");
          });
          it("Returns delete query for relation tables also", () => {
            const query = createDeleteQuery(
              sourceTable,
              relations,
              getRelationTableName
            );
            expect(query).toBe(
              "DELETE FROM SourceTable; DELETE FROM SourceTable_to_TargetTable;"
            );
          });
        });
        describe("createInsertQuery", () => {
          it("Returns empty query for constant tables", () => {
            const query = createInsertQuery(
              constantTable,
              [],
              () => "",
              () => [],
              []
            );
            expect(query).toBe("");
          });
          it("Returns insert query for the table; Multiselection relation columns are ignored, if relations param is missing", () => {
            const query = createInsertQuery(
              sourceTable,
              [],
              () => "",
              () => [],
              sourceRows
            );
            expect(query).toBe(
              "INSERT INTO SourceTable (id,name) VALUES (1,'John'),(2,'Jane');"
            );
          });
          it("Returns insert query for relation tables also", () => {
            const query = createInsertQuery(
              sourceTable,
              relations,
              getRelationTableName,
              getRelationRows,
              sourceRows
            );
            expect(query).toBe(
              "INSERT INTO SourceTable (id,name) VALUES (1,'John'),(2,'Jane'); INSERT INTO SourceTable_to_TargetTable (SourceTable_id,TargetTable_id) VALUES (1,1),(1,3); INSERT INTO SourceTable_to_TargetTable (SourceTable_id,TargetTable_id) VALUES (2,2),(2,4);"
            );
          });
          it("Returns insert query for main table only, if no targetRows are found", () => {
            const query = createInsertQuery(
              sourceTable,
              relations,
              getRelationTableName,
              () => [],
              sourceRows
            );
            expect(query).toBe(
              "INSERT INTO SourceTable (id,name) VALUES (1,'John'),(2,'Jane');"
            );
          });
        });
        describe("getDeleteQuery", () => {
          it("returns delete query for the table", () => {
            const query = getDeleteQuery("SourceTable");
            expect(query).toBe("DELETE FROM SourceTable;");
          });
        });
        describe("getInsertQuery", () => {
          it("returns insert query for the table", () => {
            const query = getInsertQuery(
              "SourceTable",
              ["id", "name"],
              sourceRows
            );
            expect(query).toBe(
              "INSERT INTO SourceTable (id,name) VALUES (1,'John'),(2,'Jane');"
            );
          });
        });
      });
    });
  });
});
