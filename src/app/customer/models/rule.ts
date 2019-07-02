export interface Rule {
  type: RuleType;
  columns: Array<RuleColumn>;
  detail: string;
  status: RuleStatus;
  isSelected: boolean;
  sortColumn: string;
}
export enum RuleType {
  columns = 1,
  filter = 2,
  pagination = 3,
  sorter = 4,
  goldenCustomer = 5,
  deduplicateExact = 6,
  deduplicateSimilarity = 7
}
export enum RuleOrder {
  columns = '6',
  filter = '4',
  pagination = '3',
  sorter = '5',
  goldenCustomer = '1',
  deduplicate = '2'
}
export enum MatchType {
  Exact = 'Exact',
  Similarity = 'Similarity'
}
export enum RuleStatus {
  Applied = 1,
  Error = 2,
  Pending = 3
}

export interface RuleColumn {
  ColumnName: string;
  ColumnValue: string;
}
