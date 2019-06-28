export interface Rule {
  type: RuleType;
  column: string;
  value: string;
  detail: string;
  status: RuleStatus;
  isSelected: boolean;
}
export enum RuleType {
  columns = 'columns',
  filter = 'filter',
  pagination = 'pagination',
  sorter = 'sorter',
  goldenCustomer = 'goldenCustomer',
  deduplicate = 'deduplicate'
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
