import { MatchType } from './rule';

export class DedupeFieldType {
    fieldId: string;
    fieldName: string;
    matchType: MatchType;
    ignoreCase: boolean;
    matchOnEmpty: boolean;
    enableSynonymMatching: boolean;
    count?: number;

    public static getDedupeMatchTypes() {
      const matchTypes = [];
      for (const key of Object.keys(MatchType)) {
        matchTypes.push(MatchType[key]);
      }
  
      return matchTypes;
    }
  }
 