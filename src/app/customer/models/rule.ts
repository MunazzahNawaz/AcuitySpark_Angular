export interface Rule {
  type: RuleType;
  columns: Array<RuleColumn>;
  detail: string;
  status: RuleStatus;
  isSelected: boolean;
  sortColumn: string;
}
export enum RuleType {
  columns = 'columns',
  filter = 'filter',
  pagination = 'pagination',
  sorter = 'sorter',
  goldenCustomer = 'goldenCustomer',
  deduplicateExact = 'deduplicateExact',
  deduplicateSimilarity = 'deduplicateSimilarity'
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
  Applied = 'Applied',
  Error = 'Error',
  Pending = 'Pending'
}

export interface RuleColumn {
  ColumnName: string;
  ColumnValue: string;
}
