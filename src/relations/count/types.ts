export type RelationCountCondition<TSourceRow, TTargetRow> = (
  sourceRow: TSourceRow,
  targetRow: TTargetRow
) => boolean;
