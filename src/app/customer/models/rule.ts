export interface Rule {
  Type: RuleType;
  Columns: Array<RuleColumn>;
  Detail: string;
  Status: RuleStatus;
  IsSelected: boolean;
  SortColumn: string;
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
  Latest = 1,
  Earliest = 2
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
  ColumnName: string;
  ColumnValue: string;
  ReplaceWith?: string;
}
