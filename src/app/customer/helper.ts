import { PhoneFormat, DataCleansingRuleTypes, MatchType, RuleStatus, RuleType } from './models/rule';

export class Helper {
  // function for dynamic sorting
  public static compareValues(key, order = 'asc') {
    return (a, b) => {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }
      const varA = typeof a[key] === 'string' ? a[key].toUpperCase().trim() : a[key];
      const varB = typeof b[key] === 'string' ? b[key].toUpperCase().trim() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return order == 'desc' ? comparison * -1 : comparison;
    };
  }
  public static getRuleObject(allCustomerFields, columnDbName, ruleTypeId, columnValue, replaceWith, specialChars?) {
    const currentField = allCustomerFields.find(x => x.columnDbName == columnDbName);

    let detailValue = columnValue;
    let description = '';
    switch (ruleTypeId) {
      case RuleType.formatPhone_WithBrackets:
        detailValue = Helper.getPhoneFormatByRuleType(RuleType.formatPhone_WithBrackets);
        description = 'Format ' + currentField.columnDisplayName + ' as ' + detailValue;
        break;
      case RuleType.formatPhone_withSpaces:
        detailValue = Helper.getPhoneFormatByRuleType(RuleType.formatPhone_withSpaces);
        description = 'Format ' + currentField.columnDisplayName + ' as ' + detailValue;
        break;
      case RuleType.formatPhone_WithHyphen:
        detailValue = Helper.getPhoneFormatByRuleType(RuleType.formatPhone_WithHyphen);
        description = 'Format ' + currentField.columnDisplayName + ' as ' + detailValue;
        break;
      case RuleType.trim:
        detailValue = '';
        description = 'Trim ' + currentField.columnDisplayName;
        break;
      case RuleType.toUpper:
        detailValue = '';
        description = 'Convert ' + currentField.columnDisplayName + ' to Upper Case';
        break;
      case RuleType.toLower:
        detailValue = '';
        description = 'Convert ' + currentField.columnDisplayName + ' to Lower Case';
        break;
      case RuleType.toTitleCase:
        detailValue = '';
        description = 'Convert ' + currentField.columnDisplayName + ' to Title Case';
        break;
      case RuleType.replace:
        // replaceWith = '';
        description = 'Replace ' + detailValue + ' with ' + replaceWith + ' in ' + currentField.columnDisplayName;
        break;
      case RuleType.remove:
        replaceWith = '';
        description = 'Remove ' + detailValue + ' from ' + currentField.columnDisplayName;
        break;
      // case RuleType.addressStandardization:
      //   replaceWith = '';
      //   description = 'Standardization ';
      //   break;
      case RuleType.removeSpecialCharacters:
        detailValue = '';
        description = 'Remove Special Characters (' + specialChars + ') from ' + currentField.columnDisplayName;
        break;

    }

    const currentRule = {
      ruleId: 0,
      ruleTypeId: ruleTypeId,
      ruleColumn: [{
        columnDbName: currentField.columnDbName,
        columnDisplayName: currentField.columnDisplayName,
        columnValue: detailValue,
        matchType: MatchType.Exact,
        ignoreCase: false,
        alternateColumnName: '',
        matchonEmpty: false,
        ignoreValues: ''
      }],
      ruleDescription: description, // 'Change ' + currentField.columnDisplayName + ' to Upper case',
      // CustomerFields.getFieldNameById(this.allCustomerFields, colName) + ' to Upper case',//currentField1.columnDisplayName,
      status: RuleStatus.Pending,
      replaceWith: replaceWith,
      replaceStr: detailValue,
      goldenRuleCriteria: '',
      goldenRuleDefaultFieldValue: '',
      goldenRuleDefaultIndValue: '',
      count: 0
    };
    return currentRule;
  }

  public static getPhoneFormatValue(format: PhoneFormat) {
    let phoneFormat = '';
    switch (format) {
      case PhoneFormat.Bracket:
        phoneFormat = "(###) ### ####";
        break;
      case PhoneFormat.Hyphen:
        phoneFormat = "###-###-####";
        break;
      case PhoneFormat.Space:
        phoneFormat = "### ### ####";
        break;
    }
    return phoneFormat;
  }
  public static getPhoneFormatByRuleType(format: RuleType) {
    let phoneFormat = '';
    switch (format) {
      case RuleType.formatPhone_WithBrackets:
        phoneFormat = "(###) ### ####";
        break;
      case RuleType.formatPhone_WithHyphen:
        phoneFormat = "###-###-####";
        break;
      case RuleType.formatPhone_withSpaces:
        phoneFormat = "### ### ####";
        break;
    }
    return phoneFormat;
  }
  public static formatPhoneNumber_withBrackets(phoneNumberString) {
    if (phoneNumberString !== null && phoneNumberString !== undefined) {
      let newPh = '';
      const index = phoneNumberString.indexOf('+1');
      if (index >= 0) {
        phoneNumberString = phoneNumberString.substring(2, phoneNumberString.length);
      }
      const cleaned = ('' + phoneNumberString)
        .replace(/\D/g, '')
        .replace('/(/g', '')
        .replace('/)/g', '')
        .replace('/+/g', '')
        .replace('/-/g', '');
      const match = cleaned.match(/^(\d{3})(\d{3})(\d.*)$/);
      if (match) {
        newPh = '(' + match[1] + ') ' + match[2] + ' ' + match[3];
      }
      return newPh;
    }
  }
  public static formatPhoneNumber_withHyphen(phoneNumberString) {
    if (phoneNumberString !== null && phoneNumberString !== undefined) {
      const index = phoneNumberString.indexOf('+1');
      if (index >= 0) {
        phoneNumberString = phoneNumberString.substring(2, phoneNumberString.length);
      }
      const cleaned = ('' + phoneNumberString)
        .replace(/\D/g, '')
        .replace('/(/g', '')
        .replace('/)/g', '')
        .replace('/+/g', '')
        .replace('/-/g', '');
      const match = cleaned.match(/^(\d{3})(\d{3})(\d.*)$/);
      if (match) {
        return match[1] + '-' + match[2] + '-' + match[3];
      }
      return null;
    }
  }
  public static formatPhoneNumber_withSpace(phoneNumberString) {
    if (phoneNumberString !== null && phoneNumberString !== undefined) {
      const index = phoneNumberString.indexOf('+1');
      if (index >= 0) {
        phoneNumberString = phoneNumberString.substring(2, phoneNumberString.length);
      }
      const cleaned = ('' + phoneNumberString)
        .replace(/\D/g, '')
        .replace('/(/g', '')
        .replace('/)/g', '')
        .replace('/+/g', '')
        .replace('/-/g', '');
      const match = cleaned.match(/^(\d{3})(\d{3})(\d.*)$/);
      if (match) {
        return match[1] + ' ' + match[2] + ' ' + match[3];
      }
      return null;
    }
  }
  public static getRandomNumber(min, max) {
    return Math.floor(Math.random() * max + min);
  }
  public static formatDate_YMD(stringDate: string) {
    var d = new Date(stringDate),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('/');
  }
  public static formatDate_MDY(stringDate: string) {
    var d = new Date(stringDate),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [month, day, year].join('/');
  }
}
