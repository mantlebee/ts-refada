import { Any, List } from "@mantlebee/ts-core";

import { QueryRelation } from "@/drivers";
import { ITable } from "@/interfaces";
import { MultiselectionRelationColumn } from "@/relations";
import { ConstantTable } from "@/tables";

export function createDeleteQuery<TRow>(
  table: ITable<TRow>,
  relations: List<QueryRelation<TRow>>,
  getRelationTableName: (relation: QueryRelation<TRow>) => string
): string {
  let queries = [];
  if (!(table instanceof ConstantTable))
    queries.push(getDeleteQuery(table.name));
  relations.forEach((a) =>
    queries.push(getDeleteQuery(getRelationTableName(a)))
  );
  return queries.join(" ");
}

export function createInsertQuery<TRow>(
  table: ITable<TRow>,
  relations: List<QueryRelation<TRow>>,
  getRelationTableName: (relation: QueryRelation<TRow>) => string,
  getRelationRows: (relation: QueryRelation<TRow>, row: TRow) => List<Any>,
  rows: List<TRow>
): string {
  let queries = [];
  if (!(table instanceof ConstantTable)) {
    const columnNames = table.columns
      .filter((a) => !(a instanceof MultiselectionRelationColumn))
      .map((a) => a.name);
    queries.push(getInsertQuery(table.name, columnNames, rows));
  }
  rows.forEach((row) => {
    relations.forEach((a) => {
      const relationRows = getRelationRows(a, row);
      if (!relationRows.length) return;
      const relationColumnNames = Object.keys(relationRows[0] as Any);
      const relationQuery = getInsertQuery(
        getRelationTableName(a),
        relationColumnNames,
        relationRows
      );
      queries.push(relationQuery);
    });
  });
  return queries.join(" ");
}

export function getDeleteQuery(tableName: string): string {
  return `DELETE FROM ${tableName};`;
}

export function getInsertQuery(
  tableName: string,
  columnNames: List<string>,
  rows: List<Any>
): string {
  const valuesQuery = rows
    .map((row) => `(${columnNames.map((a) => row[a])})`)
    .join(",");
  return `INSERT INTO ${tableName} (${columnNames.join(",")}) VALUES ${valuesQuery};`;
}
