/**
 * Represents a query builder intended to be used to generate queries,
 * starting from REFADA tables.
 */
export interface ITableQueryBuilder {
  readonly tableName: string;
  getDeleteQuery(): string;
  getInsertQuery(): string;
}
