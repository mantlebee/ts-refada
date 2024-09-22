export interface ITableQueryBuilder {
  readonly tableName: string;
  getDeleteQuery(): string;
  getInsertQuery(): string;
}
