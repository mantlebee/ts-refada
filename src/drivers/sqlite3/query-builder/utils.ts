import { Any, List } from "@mantlebee/ts-core";

import { QueryRelation } from "@/drivers";
import { ITable } from "@/interfaces";
import { TableConstant } from "@/models";
import { MultiselectionRelationColumn } from "@/relations";

export function createDeleteQuery<TRow>(
  table: ITable<TRow>,
  relations: List<QueryRelation<TRow>>,
  getRelationTableName: (relation: QueryRelation<TRow>) => string
): string {
  let query = "";
  if (!(table instanceof TableConstant)) getDeleteQuery(table.name);
  relations.forEach((a) => (query += getDeleteQuery(getRelationTableName(a))));
  return query;
}

export function createInsertQuery<TRow>(
  table: ITable<TRow>,
  relations: List<QueryRelation<TRow>>,
  getRelationTableName: (relation: QueryRelation<TRow>) => string,
  getRelationRows: (relation: QueryRelation<TRow>, row: TRow) => List<TRow>,
  rows: List<TRow>
): string {
  let query = "";
  if (!(table instanceof TableConstant)) {
    const columnNames = table.columns
      .filter((a) => !(a instanceof MultiselectionRelationColumn))
      .map((a) => a.name);
    getInsertQuery(table.name, columnNames, rows);
  }
  rows.forEach((row) => {
    relations.forEach((a) => {
      const relationRows = getRelationRows(a, row);
      if (!relationRows.length) return;
      const relationColumnNames = Object.keys(relationRows[0] as Any);
      query += getInsertQuery(
        getRelationTableName(a),
        relationColumnNames,
        relationRows
      );
    });
  });
  return query;
}

function getDeleteQuery(tableName: string): string {
  return `DELETE FROM ${tableName};`;
}

function getInsertQuery(
  tableName: string,
  columnNames: List<string>,
  rows: List<Any>
): string {
  const valuesQuery = rows
    .map((row) => `(${columnNames.map((a) => row[a])})`)
    .join(",");
  return `INSERT INTO ${tableName} (${columnNames.join(",")}) VALUES ${valuesQuery};`;
}
