import { Any, List } from "@mantlebee/ts-core";

import { QueryRelation } from "@/drivers";

export function createDeleteQuery<TRow>(
  tableName: string,
  relations: List<QueryRelation<TRow>>,
  getRelationTableName: (relation: QueryRelation<TRow>) => string
): string {
  let query = getDeleteQuery(tableName);
  relations.forEach((a) => (query += getDeleteQuery(getRelationTableName(a))));
  return query;
}

export function createInsertQuery<TRow>(
  tableName: string,
  columnNames: List<string>,
  relations: List<QueryRelation<TRow>>,
  getRelationTableName: (relation: QueryRelation<TRow>) => string,
  getRelationRows: (relation: QueryRelation<TRow>, row: TRow) => List<TRow>,
  rows: List<TRow>
): string {
  let query = getInsertQuery(tableName, columnNames, rows);
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
