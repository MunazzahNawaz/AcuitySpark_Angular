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
  deduplicateSimilarity = 7,
  manualReview = 8,
  replace = 9,
  trim = 10,
  toUpper = 11,
  toLower = 12,
  toTitleCase = 13,
  formatPhone = 14,
  removeSpecialCharacters = 15
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

export enum GoldenFieldValueType {
  'NA' = -1,
  'False' = 0,
  'True' = 1,
  'Latest Available' = 2,
  'Earliest Available' = 3,
}
export enum RuleStatus {
  Applied = 1,
  Error = 2,
  Pending = 3
}
export enum PhoneFormat {
  Bracket = 1,
  Hyphen = 2,
  Space = 3
}

export interface RuleColumn {
  columnName: string;
  columnValue: string;
  replaceWith?: string;
}
