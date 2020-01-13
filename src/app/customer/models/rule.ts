export class Rule {
  ruleId?: number;
  ruleTypeId: RuleType;
  ruleColumn: Array<RuleColumn>;
  ruleDescription: string;
  status: RuleStatus;
  replaceWith?: string;
  replaceStr: string;
  goldenRuleCriteria: string;
  goldenRuleDefaultFieldValue: string;
  goldenRuleDefaultIndValue: string;
  alternateColumnName?: string;
  count?: number;

  public static getStringTypeRules() {
    const ruleTypes = [];
    ruleTypes.push(DataCleansingRuleTypes[DataCleansingRuleTypes['To Lower Case']].toString());
    ruleTypes.push(DataCleansingRuleTypes[DataCleansingRuleTypes['To Title Case']].toString());
    ruleTypes.push(DataCleansingRuleTypes[DataCleansingRuleTypes['To Upper Case']].toString());
    ruleTypes.push(DataCleansingRuleTypes[DataCleansingRuleTypes.Trim].toString());
    ruleTypes.push(DataCleansingRuleTypes[DataCleansingRuleTypes.Remove].toString());
    ruleTypes.push(DataCleansingRuleTypes[DataCleansingRuleTypes.Replace].toString());
    ruleTypes.push(DataCleansingRuleTypes[DataCleansingRuleTypes['Remove Special Characters']].toString());
   // ruleTypes.push(DataCleansingRuleTypes[DataCleansingRuleTypes['Standardization']].toString());
    return ruleTypes;
  }
  public static getPhoneRules() {
    const ruleTypes = [];
    ruleTypes.push(DataCleansingRuleTypes[DataCleansingRuleTypes['Format Phone ### ### ####']].toString());
    ruleTypes.push(DataCleansingRuleTypes[DataCleansingRuleTypes['Format Phone ###-###-####']].toString());
    ruleTypes.push(DataCleansingRuleTypes[DataCleansingRuleTypes['Format Phone (###) ### ####']].toString());
    return ruleTypes;
  }
}

export enum RuleType {
  replace = 1,
  remove = 2,
  trim = 3,
  toUpper = 4,
  toLower = 5,
  toTitleCase = 6,
  formatPhone_WithBrackets = 7,
  removeSpecialCharacters = 8,
  unmerge = 9,
  formatPhone_WithHyphen = 10,
  goldenCustomer = 11,
  recordLinkage = 12,
  customerMasterAssignment = 13,
  manualMerge = 14,
  deduplication = 15,
  candidateMerge = 16,
  formatPhone_withSpaces = 17,
  UserDedupe = 18,
  toCamelCase = 19
//  addressStandardization = 20
}
export enum DataCleansingRuleTypes {
  Replace = 1,
  Remove = 2,
  Trim = 3,
  'To Upper Case' = 4,
  'To Lower Case' = 5,
  'To Title Case' = 6,
  'Remove Special Characters' = 8,
  'Format Phone (###) ### ####' = 7,
  'Format Phone ###-###-####' = 10,
  'Format Phone ### ### ####' = 17
 // 'Standardization' = 20
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
  Exact = 'Exact' //
  // Similarity = 'Similarity'
}

export enum GoldenFieldValueType {
  'Latest Available' = 1,
  'Earliest Available' = 2
}
export enum GoldenIndicatorValueType {
  'No' = 0,
  'Yes' = 1
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
export enum GoldenDefaultOrder {
  'Newest Modified Date' = 1,
  'Oldest Modified Date' = 2,
  'Newest Creation Date' = 3,
  'Oldest Creation Date' = 4

}

export enum DefaultOrder {
  'asc' = 'Earliest',
  'desc' = 'Latest'
}
export interface RuleColumn {
  columnDbName: string;
  columnDisplayName: string;
  columnValue: string;
  matchType: string;
  ignoreCase: boolean;
  matchonEmpty: boolean;
  alternateColumnName: string;
  ignoreValues: string;
}

export interface ReplaceDetail {
  replaceStr: string;
  replaceWith: string;
  matchExact: boolean;
  isReplace: boolean;
  ignoreCase: boolean;
}
