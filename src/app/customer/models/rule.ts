export interface Rule {
  type: RuleType;
  column: string;
  value: string;
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
export enum MatchType {
  Exact = 'Exact',
  Similarity = 'Similarity'
}
export enum RuleStatus {
  Applied = 'Applied',
  Error = 'Error',
  Pending = 'Pending'
}
