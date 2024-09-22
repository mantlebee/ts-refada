import { List } from "@mantlebee/ts-core";

import { ITableQueryBuilder, QueryRelation } from "@/drivers";
import { IDatabase, ITable } from "@/interfaces";
import { MultiselectionRelationColumn } from "@/relations";

import { createDeleteQuery, createInsertQuery } from "./utils";

export class Sqlite3TableQueryBuilder<TRow> implements ITableQueryBuilder {
  private readonly columnNames: List<string>;
  private readonly relations: List<QueryRelation<TRow>>;

  public constructor(
    private readonly table: ITable<TRow>,
    private readonly database: IDatabase,
    private readonly getRelationTableName: (
      relation: QueryRelation<TRow>
    ) => string,
    private readonly getRelationRows: (
      relation: QueryRelation<TRow>,
      sourceRow: TRow
    ) => List<TRow>
  ) {
    this.columnNames = table.columns
      .filter((a) => !(a instanceof MultiselectionRelationColumn))
      .map((a) => a.name);
    this.relations = table.columns
      .filter((a) => a instanceof MultiselectionRelationColumn)
      .map((a) => ({
        sourceColumn: a,
        targetTable: database.getTable(a.targetTableKey),
      }));
  }

  public get tableName(): string {
    return this.table.name;
  }

  public getDeleteQuery(): string {
    return createDeleteQuery(
      this.tableName,
      this.relations,
      this.getRelationTableName
    );
  }
  public getInsertQuery(): string {
    const rows = this.table.getRows();
    if (!rows.length) return "";
    return createInsertQuery(
      this.tableName,
      this.columnNames,
      this.relations,
      this.getRelationTableName,
      this.getRelationRows,
      rows
    );
  }
}
