import { GoldenFieldValueType, GoldenIndicatorValueType, DefaultOrder } from './rule';
// import { FieldType, Editors } from 'angular-slickgrid';

export class CustomerColumn {
  columnId: number;
  columnDbName: string;
  columnDisplayName: string;
  ruleDataType: string;
  isGolden: boolean;
  isHidden: boolean;
  isDedupe: boolean;
  fieldOrder: number;
  isCandidateMerge: boolean;
  isMasterOrderBy: boolean;
  isRuleField: boolean;
}
export enum FieldDataTypes {
  'text' = 'text',
  'Date' = 'datetime ',
  'Numeric' = 'numeric',
  'phone' = 'phone'
}

export class CustomerFields {

  public static getFieldDataTypeByDbName(customerFields, columnDbName) {
    const field = customerFields.find(x => (x.columnDbName == columnDbName));
    if (field) {
      return field.ruleDataType;
    }
    return FieldDataTypes.text;
  }

  public static getFieldDataTypeByDisplayName(customerFields, columnDisplayName) {
    const field = customerFields.find(x => (x.columnDisplayName == columnDisplayName));
    if (field) {
      return field.ruleDataType;
    }
    return FieldDataTypes.text;

  }
  public static isDateField(customerFields, columnDbName) {
    const field = customerFields.find(x => (x.columnDbName == columnDbName));
    if (field && field.ruleDataType == FieldDataTypes.Date) {
      return true;
    }
    return false;
  }
  public static isDateFieldByColName(customerFields, columnDisplayName) {
    const field = customerFields.find(x => (x.columnDisplayName == columnDisplayName));
    if (field && field.ruleDataType == FieldDataTypes.Date) {
      return true;
    }
    return false;
  }
  public static isNumericFieldByColName(customerFields, columnDisplayName) {
    const field = customerFields.find(x => (x.columnDisplayName == columnDisplayName));
    if (field && field.ruleDataType == FieldDataTypes.Numeric) {
      return true;
    }
    return false;
  }
  public static isStringFieldByColName(customerFields, columnDisplayName) {
    const field = customerFields.find(x => (x.columnDisplayName == columnDisplayName));
    if (field && field.ruleDataType == FieldDataTypes.text) {
      return true;
    }
    return false;
  }
  public static isRuleFieldByColName(customerFields, columnDisplayName) {
    const field = customerFields.find(x => (x.columnDisplayName == columnDisplayName));
    if (field && field.isRuleField) {
      return true;
    }
    return false;
  }
  public static getCustomerFields(customerFields, dbNameOnly: boolean, displayNameOnly: boolean, both: boolean, isAssigned: boolean = false) {
    const targetFields = [];

    customerFields.forEach(f => {
      if (!f.isHidden && f.isAssigned == isAssigned) {
        if (dbNameOnly) {
          targetFields.push(f.columnDbName);
        } else if (displayNameOnly) {
          targetFields.push(f.columnDisplayName);
        } else if (both) {
          targetFields.push({ id: f.columnDbName, name: f.columnDisplayName });
        }
      }
    });
    return targetFields;
  }
  public static getRuleFields(customerFields, dbNameOnly: boolean, displayNameOnly: boolean, both: boolean) {
    const targetFields = [];

    customerFields.forEach(f => {
      if (f.isRuleField) {
        if (dbNameOnly) {
          targetFields.push(f.columnDbName);
        } else if (displayNameOnly) {
          targetFields.push(f.columnDisplayName);
        } else if (both) {
          targetFields.push({ id: f.columnDbName, name: f.columnDisplayName });
        }
      }
    });
    return targetFields;
  }
  // public static getCustomerDedupeFields(customerFields, dbNameOnly: boolean, displayNameOnly: boolean, both: boolean) {
  //   const targetFields = [];
  //   customerFields.forEach(f => {
  //     if (f.isDedupe) {
  //       if (dbNameOnly) {
  //         targetFields.push(f.columnDbName);
  //       } else if (displayNameOnly) {
  //         targetFields.push(f.columnDisplayName);
  //       } else if (both) {
  //         targetFields.push({ id: f.columnDbName, name: f.columnDisplayName });
  //       }
  //     }
  //   });
  //   return targetFields;
  // }
  public static getCustomerDedupeFields(dbNameOnly: boolean, displayNameOnly: boolean, both: boolean) {
    const targetFields = [];
    if (dbNameOnly) {
      targetFields.push('name');
      targetFields.push('email');
      targetFields.push('phone');
      targetFields.push('address');
    } else if (displayNameOnly) {
      targetFields.push('Name');
      targetFields.push('Email');
      targetFields.push('Phone');
      targetFields.push('Address');
    } else if (both) {
      targetFields.push({ id: 'name', name: 'Name' });
      targetFields.push({ id: 'email', name: 'Email' });
      targetFields.push({ id: 'phone', name: 'Phone' });
      targetFields.push({ id: 'address', name: 'Address' });
    }
    return targetFields;
  }
  public static getFilterFields(customerFields, dbNameOnly: boolean, displayNameOnly: boolean, both: boolean) {
    const targetFields = [];

    customerFields.forEach(f => {
      if (f.isFilterField) {
        if (dbNameOnly) {
          targetFields.push(f.columnDbName);
        } else if (displayNameOnly) {
          targetFields.push(f.columnDisplayName);
        } else if (both) {
          targetFields.push({ id: f.columnDbName, name: f.columnDisplayName });
        }
      }
    });
    return targetFields;
  }
  public static getCustomerGoldenFields(customerFields, dbNameOnly: boolean, displayNameOnly: boolean, both: boolean) {
    const targetFields = [];

    customerFields.forEach(f => {
      if (f.isGolden) {
        if (dbNameOnly) {
          targetFields.push(f.columnDbName);
        } else if (displayNameOnly) {
          targetFields.push(f.columnDisplayName);
        } else if (both) {
          targetFields.push({ id: f.columnDbName, name: f.columnDisplayName });
        }
      }
    });
    return targetFields;
  }
  public static getOrderByFields(customerFields, dbNameOnly: boolean, displayNameOnly: boolean, both: boolean) {
    const targetFields = [];

    customerFields.forEach(f => {
      if (f.isMasterOrderBy) {
        if (dbNameOnly) {
          targetFields.push(f.columnDbName);
        } else if (displayNameOnly) {
          targetFields.push(f.columnDisplayName);
        } else if (both) {
          targetFields.push({ id: f.columnDbName, name: f.columnDisplayName });
        }
      }
    });
    return targetFields;
  }
  public static getOrderBy() {
    const orderByValues = [];
    for (const key of Object.keys(DefaultOrder)) {
      //  if (!Number.isNaN(parseInt(key, 10))) {
      // key of enum cannot be number
      orderByValues.push(DefaultOrder[key]);
      // }
    }

    return orderByValues;
  }

  public static getGoldenFieldValueType() {
    const orderByValues = [];
    for (const key of Object.keys(GoldenFieldValueType)) {

      if (!Number.isNaN(parseInt(key, 10))) {
        // key of enum cannot be number
        orderByValues.push(GoldenFieldValueType[key]);
      }

    }

    return orderByValues;
  }

  public static getGoldenIndicatorValueType() {
    const orderByValues = [];
    for (const key of Object.keys(GoldenIndicatorValueType)) {

      if (!Number.isNaN(parseInt(key, 10))) {
        // key of enum cannot be number
        orderByValues.push(GoldenIndicatorValueType[key]);
      }

    }

    return orderByValues;
  }
  public static getColumns(customerFields, isAssigned = false) {
    const colDef = [];
    // const targetFields = this.getCustomerFields(false, false, true);
    customerFields.forEach(col => {
      if (!col.isHidden && col.isAssigned == isAssigned) {
        colDef.push({
          id: col.columnDbName,
          name: col.columnDisplayName,
          field: col.columnDbName,
          sortable: true,
          filterable: true,
          // type: FieldType.string,
          // editor: { model: Editors.text },
          minWidth: 150
        });
      }
    });

    return colDef;
  }
}
export class AppTransactionConfig {
  public UserEmail = '';
  public MinTransactionDate: Date;
  public MaxTransactionDate: Date;
  public MinTransactionCount = 0;
  public MaxTransactionCount = 0;
  public MinRecency = 0;
  public MaxRecency = 0;
  public MinLifeTimeTransCount = 0;
  public SalesChannel = 0;
  public loadDate: Date;
  public ActivityIndicator = 0;
}

export class Customer {
  private static targetFields = [];

  // public static getCustomerTransactionFields() {
  //   const targetFields = [];
  //   for (const key of Object.keys(CustomerTransaction)) {
  //     targetFields.push(CustomerTransaction[key]);
  //   }

  //   return targetFields;
  // }
}
