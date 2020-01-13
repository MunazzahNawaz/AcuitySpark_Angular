import { Component, OnInit } from '@angular/core';
import { CustomerFields, FieldDataTypes } from '../models/customer';
import { DedupeFieldType } from '../models/dedupe';
import { MatchType, RuleType, RuleStatus, Rule, ReplaceDetail, RuleColumn, DefaultOrder, DataCleansingRuleTypes } from '../models/rule';
import { StoreService } from '../services/store.service';
import { HeaderService } from '../../layout/services/header.service';
import { Helper } from '../helper';
import { RuleService } from '../services/rule.service';
import { MatDialog } from '@angular/material/dialog';
import { ReplaceComponent } from '../replace/replace.component';
import { CustomerService } from '../services/customer.service';
import { AppConfigService } from 'src/app/app-config.service';
import { WarningComponent } from '../warning/warning.component';
import { AddressStandardComponent } from '../address-standard/address-standard.component';
import { NameStandardComponent } from '../name-standard/name-standard.component';
declare var toastr;

@Component({
  selector: 'app-dedupe',
  templateUrl: './rule-engine.component.html',
  styleUrls: ['./rule-engine.component.scss']
})
export class RuleEngineComponent implements OnInit {
  checkField = ['Name', 'Email', 'Phone'];
  defaultText = 'default';
  dedupeDropDown = [];
  allFields = [];
  dedupeSelectedFields: Array<DedupeFieldType> = [];
  dataCleansingSelectedFields: Array<any> = [];
  selectedDedupeFieldName = [];
  selectedFieldName = [];
  matchTypes;
  rules: Array<Rule> = [];
  ruleCount: Array<any> = [];
  allCustomerFields = [];
  defaultOrder: Array<string> = [];
  isAssignedCols;
  customerOrder = [];
  defaultOrderBy;
  defaultOrderByCol;
  allRuleSets;
  selectedRuleSet;
  selectedRuleType: DataCleansingRuleTypes;
  allRuleTypes;
  ruleColDetailValue = '';
  replaceWith = '';
  ruleSetName = '';
  isNew = false;
  defaultRuleSetName;
  ruleNameError = '';
  currentSelectedRuleSetId = 0;
  ruleEngineScreenButton = 'UPDATE';
  sendBackToSource = false;
  isProcessing = false;

  replaceData: ReplaceDetail = { isReplace: true, ignoreCase: true, replaceStr: '', replaceWith: '', matchExact: true };
  constructor(
    private storeService: StoreService,
    private ruleService: RuleService,
    public headerService: HeaderService,
    private customerService: CustomerService,
    private appConfig: AppConfigService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.allRuleTypes = this.getCleansingRuleTypes();
    this.headerService.setTitle('Rule Engine');
    this.storeService.getUserSettings().subscribe(x => {
      if (x && x != null) {
        this.allCustomerFields = x;
        this.allFields = CustomerFields.getRuleFields(this.allCustomerFields, false, false, true);
        this.dedupeDropDown = CustomerFields.getCustomerDedupeFields(false, true, false);
        this.customerOrder = CustomerFields.getOrderByFields(this.allCustomerFields, false, false, true);

        this.storeService.getCustomerArchivedRules().subscribe(ruleSetLst => {
          this.allRuleSets = ruleSetLst;
          if (this.allRuleSets != null) {
            let defaultRuleSet = this.allRuleSets.filter(x => x.ruleSet.isDefault == true);

            if (this.currentSelectedRuleSetId > 0) {
              defaultRuleSet = this.allRuleSets.filter(x => x.ruleSet.ruleSetId == this.currentSelectedRuleSetId);
            }

            this.selectedRuleSet = (defaultRuleSet && defaultRuleSet.length > 0) ? defaultRuleSet[0].ruleSet : null;

            // console.log('IN ON INIT SELECTED RULE SET', this.selectedRuleSet);
            this.onRuleSetChange();
          }

        });
      }
    });

    this.matchTypes = DedupeFieldType.getDedupeMatchTypes();
    this.defaultOrder = CustomerFields.getOrderBy();
  }


  isRuleSetValid() {
    if (this.ruleNameError === '') {
      return true;
    }
    return false;
  }

  getCleansingRuleTypes() {
    const ruleTypes = [];
    for (const key of Object.keys(DataCleansingRuleTypes)) {
      if (!Number.isNaN(parseInt(key, 10))) {
        // key of enum cannot be number
        ruleTypes.push(DataCleansingRuleTypes[key]);
      }
    }
    return ruleTypes.sort().reverse();
  }
  isDataCleansingRules(ruleType) {
    if ((ruleType >= 1 && ruleType <= 8) || ruleType == 10 || ruleType == 17 || ruleType == 20) {
      return true;
    }
    return false;
  }
  isDedupeRule(ruleType) {
    if (ruleType == 15 || ruleType == 12) {
      return true;
    }
    return false;
  }
  onRuleSetChange() {
    this.dataCleansingSelectedFields = [];
    this.dedupeSelectedFields = [];
    this.selectedDedupeFieldName = [];

    if (this.selectedRuleSet) {
      this.sendBackToSource = this.selectedRuleSet.sendBackToSource;
      this.selectedRuleSet.rules.forEach(rule => {
       // console.log('rule', rule);
        if (this.isDataCleansingRules(rule.ruleTypeId)) {
          const currentRule = Helper.getRuleObject(
            this.allCustomerFields,
            rule.ruleColumn[0].columnDbName,
            rule.ruleTypeId,
            rule.replaceStr,
            rule.replaceWith, this.appConfig.getConfig('specialCharacters'));
          currentRule.ruleId = rule.ruleId;
          this.dataCleansingSelectedFields.push(currentRule);

          this.customerService.getRuleCount(currentRule.ruleColumn, currentRule.ruleTypeId).subscribe(resp => {
            currentRule.count = resp.countRowsEffected;
          });
        } else {

          // if (this.isDedupeRule(rule.ruleTypeId)) {
          if (rule.ruleTypeId == RuleType.UserDedupe) {
            let ruleColumns = [];
            if (rule.ruleColumn && rule.ruleColumn.length > 0) {
              ruleColumns = rule.ruleColumn[0].columnDbName.split(',');
            }
            ruleColumns.forEach(col => {
              const currentField = this.allCustomerFields.find(x => x.columnDbName == col);
              const dupeField: DedupeFieldType = {
                fieldId: (currentField ? currentField.columnDbName : col), // CustomerFields.getFieldIdByName(this.allCustomerFields,selField),
                fieldName: (currentField ? currentField.columnDisplayName : col),
                matchType: col.matchType,
                ignoreCase: true,
                matchOnEmpty: true,
                enableSynonymMatching: true
              };
              this.dedupeSelectedFields.push(dupeField);
              const colName = (currentField ? currentField.columnDbName : (col == 'Name' ? 'firstName' : col));
              const cols = [{
                columnDbName: colName,
                columnValue: '',
                ignoreCase: true,
                matchEmpty: true
              }];
              this.customerService.getRuleCount(cols, RuleType.deduplication).subscribe(resp => {
                dupeField.count = resp.countRowsEffected;
              });
              this.selectedDedupeFieldName.push((currentField ? currentField.columnDisplayName : col));

            });
          }
          if (rule.ruleTypeId == RuleType.deduplication) {
            if (rule.ruleColumn && rule.ruleColumn.length > 0) {
              this.defaultOrderByCol = rule.ruleColumn[0].columnDbName;
              this.defaultOrderBy = DefaultOrder[rule.ruleColumn[0].columnValue];
            }
          }
        }
      });
    }
  }
  addCleansingRule() {
    // this.selectedFieldName.forEach(selField => {
    if (!this.selectedRuleType || !this.selectedFieldName || this.selectedFieldName.length <= 0) {
      toastr.info('Please select field and rule type');
      return;
    }
    const ruleTypeId = DataCleansingRuleTypes[this.selectedRuleType];
    const currentRule = Helper.getRuleObject(
      this.allCustomerFields,
      this.selectedFieldName,
      DataCleansingRuleTypes[this.selectedRuleType],
      this.ruleColDetailValue, this.replaceWith, this.appConfig.getConfig('specialCharacters'));
    this.checkRuleExist(DataCleansingRuleTypes[this.selectedRuleType], this.selectedFieldName);
    this.customerService.getRuleCount(currentRule.ruleColumn, currentRule.ruleTypeId).subscribe(resp => {
      currentRule.count = resp.countRowsEffected;
    });
    console.log('new rule', currentRule);
    this.dataCleansingSelectedFields.push(currentRule);
    // this.customerService.getRuleCount(currentRule.ruleColumn, currentRule.ruleTypeId).subscribe(resp => {
    //   currentRule.count = resp.countRowsEffected;
    // });
    this.selectedFieldName = [];
    this.selectedRuleType = undefined;
    this.replaceData.replaceStr = "";
    this.replaceData.replaceWith = "";
  }
  onDropDownRuleClick(colName) {
    const ruleTypeId = DataCleansingRuleTypes[this.selectedRuleType];
    if (ruleTypeId == DataCleansingRuleTypes.Replace.toString()) {
      this.onReplaceClick(colName);
    }
    if (ruleTypeId == DataCleansingRuleTypes.Remove.toString()) {
      this.onRemoveClick(colName);
    }
  }
  onReplaceClick(colName) {
    this.replaceData.isReplace = true;
    const dialogRef = this.dialog.open(ReplaceComponent, {
      width: '400px',
      data: this.replaceData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.replaceData = result;
        this.replaceWith = result.replaceWith;
        this.ruleColDetailValue = result.replaceStr;
        this.addCleansingRule();
      } else {
        this.selectedRuleType = undefined;
      }
    });

  }
  onRemoveClick(colName) {
    this.replaceData.isReplace = false;
    const dialogRef = this.dialog.open(ReplaceComponent, {
      width: '400px',
      data: this.replaceData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.replaceData = result;
        this.ruleColDetailValue = result.replaceStr;
        this.addCleansingRule();
      } else {
        this.selectedRuleType = undefined;
      }
    });
  }
  checkRuleExist(ruleType, colDbName) {
    let alreadyExist = false;
    let indexRem = 0;
    this.dataCleansingSelectedFields.forEach((r, indexR) => {
      const index = r.ruleColumn.findIndex(c => c.columnDbName == colDbName);
      if (index >= 0 && r.ruleTypeId == ruleType) { // if this same rule already exists then remove rule
        indexRem = indexR;
        alreadyExist = true;
      } else if (index >= 0 && this.isPhoneFormatRule(ruleType) && this.isPhoneFormatRule(r.ruleTypeId)) {
        // if this is phone format and any phone format already exist then remove prev rule
        indexRem = indexR;
        alreadyExist = true;
      } else if (index >= 0 && this.isChangeCaseRule(ruleType) && this.isChangeCaseRule(r.ruleTypeId)) {
        // if this is phone format and any phone format already exist then remove prev rule
        indexRem = indexR;
        alreadyExist = true;
      }
    });
    if (alreadyExist) {
      this.dataCleansingSelectedFields.splice(indexRem, 1);
    }
  }
  isPhoneFormatRule(ruleTypeId) {
    if (ruleTypeId == RuleType.formatPhone_WithBrackets ||
      ruleTypeId == RuleType.formatPhone_WithHyphen ||
      ruleTypeId == RuleType.formatPhone_withSpaces) {
      return true;
    }
    return false;
  }
  isChangeCaseRule(ruleTypeId) {
    if (ruleTypeId == RuleType.toLower || ruleTypeId == RuleType.toUpper || ruleTypeId == RuleType.toTitleCase) {
      return true;
    }
    return false;
  }
  resetCleansingRules() {

  }
  removeCleansingRule(rule) {
    const index = this.dataCleansingSelectedFields.indexOf(rule);
    if (index >= 0) {
      this.dataCleansingSelectedFields.splice(index, 1);
    }
    const selIndex = this.selectedFieldName.indexOf(rule.fieldName);
    if (selIndex >= 0) {
      this.selectedFieldName.splice(index, 1);
    }
    this.selectedFieldName = [...this.selectedFieldName];
  }

  editCleansingRule(rule) {
    if (this.selectedRuleType && this.selectedFieldName && this.selectedFieldName.length > 0) {
      this.addCleansingRule();
    }
    this.selectedFieldName = rule.ruleColumn[0].columnDbName;
    const selecteRule = this.allRuleTypes.filter(x => x == DataCleansingRuleTypes[rule.ruleTypeId]);
    if (selecteRule && selecteRule.length > 0) {
      this.selectedRuleType = selecteRule[0];
    }
    const index = this.dataCleansingSelectedFields.indexOf(rule);
    if (index >= 0) {
      this.dataCleansingSelectedFields.splice(index, 1);
    }
  }

  storeData() {
    if (this.selectedDedupeFieldName.length == 0) {
      toastr.info('No fields selected to be added');
      return;
    }
    if (this.selectedDedupeFieldName.length == 1) {
      toastr.info('Please select atleast two fields');
      return;
    }
    // Add selected Fields in dedupe list
    this.selectedDedupeFieldName.forEach(selField => {
      const currentField = this.allCustomerFields.find(x => x.columnDisplayName == selField);
      const isExistIndex = this.dedupeSelectedFields.findIndex(x => x.fieldName == selField);
      if (isExistIndex < 0) { // field does not exists already
        const dupeField: DedupeFieldType = {
          fieldId: currentField ? currentField.columnDbName : selField, // CustomerFields.getFieldIdByName(this.allCustomerFields,selField),
          fieldName: selField,
          matchType: MatchType.Exact,
          ignoreCase: true,
          matchOnEmpty: true,
          enableSynonymMatching: true
        };
        this.dedupeSelectedFields.push(dupeField);
        const cols = [{
          columnDbName: currentField ? currentField.columnDbName : selField,
          columnValue: '',
          ignoreCase: true,
          matchEmpty: true
        }];

        this.customerService.getRuleCount(cols, RuleType.deduplication).subscribe(resp => {
          dupeField.count = resp.countRowsEffected;
        });
      }
    });
    if (this.selectedDedupeFieldName.length < this.dedupeSelectedFields.length) {
      this.dedupeSelectedFields.forEach(dedupeField => {
        if (this.selectedDedupeFieldName.indexOf(dedupeField.fieldName) < 0) { // field removed
          // removeFieldsArray.push(dedupeField);
          const index = this.dedupeSelectedFields.indexOf(dedupeField);
          this.dedupeSelectedFields.splice(index, 1);
        }
      });
    }
  }

  removeField(field) {
    const index = this.dedupeSelectedFields.indexOf(field);
    if (index >= 0) {
      this.dedupeSelectedFields.splice(index, 1);
    }

    const selIndex = this.selectedDedupeFieldName.indexOf(field.fieldName);
    if (selIndex >= 0) {
      this.selectedDedupeFieldName.splice(index, 1);
    }

    this.selectedDedupeFieldName = [...this.selectedDedupeFieldName];
  }
  resetAll() {
    this.dedupeSelectedFields = [];
    this.selectedDedupeFieldName = [];
  }
  finalizeDedupeRules() {
    const dedupeColumns: Array<RuleColumn> = [];
    this.dedupeSelectedFields.forEach(col => {
      dedupeColumns.push({
        columnDbName: col.fieldId,
        columnDisplayName: col.fieldName,
        columnValue: col.ignoreCase.toString(),
        ignoreCase: col.ignoreCase,
        matchType: MatchType.Exact,
        matchonEmpty: col.matchOnEmpty,
        alternateColumnName: '',
        ignoreValues: ''
      });
    });
    const orderBy = this.defaultOrderBy == DefaultOrder.desc ? 'desc' : 'asc';

    const currentRule = {
      ruleTypeId: RuleType.deduplication,
      ruleColumn: dedupeColumns,
      ruleDescription: 'Deduplication Rule',
      status: RuleStatus.Pending,
      isSelected: true,
      sortColumn: '',
      goldenRuleCriteria: this.defaultOrderByCol,
      goldenRuleDefaultFieldValue: orderBy,
      goldenRuleDefaultIndValue: '',
      replaceWith: '',
      replaceStr: ''
    };
    return currentRule;
  }

  onCancelClick() {
    this.isNew = false;
    this.selectedFieldName = [];
    this.selectedRuleType = undefined;
    this.selectedDedupeFieldName = undefined;
    this.defaultOrderByCol = undefined;
    this.defaultOrderBy = undefined;
    if (this.allRuleSets != null) {
      let defaultRuleSet = this.allRuleSets.filter(x => x.ruleSet.isDefault == true);

      if (this.currentSelectedRuleSetId > 0) {
        defaultRuleSet = this.allRuleSets.filter(x => x.ruleSet.ruleSetId == this.currentSelectedRuleSetId);
      }
      this.selectedRuleSet = (defaultRuleSet && defaultRuleSet.length > 0) ? defaultRuleSet[0].ruleSet : null;
      this.onRuleSetChange();
    }
    this.ruleEngineScreenButton = 'UPDATE';
  }

  onSave() {
    if (this.selectedDedupeFieldName.length == 1) {
      toastr.info('Please select atleast two dedupe fields');
      return;
    }
    const rules = [...this.dataCleansingSelectedFields];
    if (this.dedupeSelectedFields && this.dedupeSelectedFields.length > 0) {
      if (this.defaultOrderBy == undefined || this.defaultOrderByCol == undefined) {
        toastr.info('No order selected');
        return;
      }
      rules.push(this.finalizeDedupeRules());
    }
    if (!rules || rules.length <= 0) {
      toastr.info('Please add rules to save');
      return;
    }
    console.log('new rules', rules);
    if (this.selectedRuleSet) {
      this.isProcessing = true;
      this.selectedRuleSet.rules = rules;
      this.selectedRuleSet.sendBackToSource = this.sendBackToSource;

      console.log('rules to save', rules);
      this.ruleService.saveRuleSet(this.selectedRuleSet).subscribe(resp => {
        toastr.success('Rule set saved successfully');
        this.isProcessing = false;
        this.currentSelectedRuleSetId = this.selectedRuleSet.ruleSetId;
        this.storeService.refreshCustomerArchivedRules();
      });
    } else {
      if (this.ruleSetName == '' || this.ruleSetName == null) {
        this.ruleNameError = 'Please enter rule Set Name';
        return;
      } else {
        this.ruleNameError = '';
      }
      const ruleSet = {
        ruleSetId: '',
        createdDate: new Date(),
        isDefault: false,
        ruleName: this.ruleSetName,
        rules: rules,
        sendBackToSource: this.sendBackToSource
      };
      this.isProcessing = true;
      this.ruleService.saveRuleSet(ruleSet).subscribe(resp => {
        this.isNew = false;
        ruleSet.ruleSetId = resp.ruleSetId;
        this.currentSelectedRuleSetId = resp.ruleSetId;
        this.selectedRuleSet = ruleSet;
        this.isProcessing = false;
        toastr.success('Rule set saved successfully');
        this.storeService.refreshCustomerArchivedRules();
      });
    }
  }

  AddNewRuleSet() {
    this.isNew = true;
    this.selectedRuleSet = '';
    this.dataCleansingSelectedFields = [];
    this.dedupeSelectedFields = [];
    this.selectedDedupeFieldName = [];
    this.selectedFieldName = [];
    this.defaultOrderByCol = undefined;
    this.defaultOrderBy = undefined;
    this.ruleSetName = '';
    this.ruleEngineScreenButton = 'SAVE';
  }
  deleteRuleSet() {
    const dialogRef = this.dialog.open(WarningComponent, {
      width: '450px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.selectedRuleSet.isDefault) {
          toastr.warning('Can not delete default rule set');
        } else {
          this.ruleService.deleteRuleSet(this.selectedRuleSet.ruleSetId).subscribe(resp => {
            toastr.success('Rule set deleted successfully');
            this.selectedRuleSet = '';
            this.currentSelectedRuleSetId = 0;
            this.storeService.refreshCustomerArchivedRules();
          });
        }
      }
    });
  }

  onFieldChange(event) {
    this.allRuleTypes = [];
    const field = this.allCustomerFields.find(x => (x.columnDbName == event.value));
    if (field && field.ruleDataType == FieldDataTypes.text) {
      this.allRuleTypes = Rule.getStringTypeRules();
    } else if (field && field.ruleDataType == FieldDataTypes.phone) {
      this.allRuleTypes = Rule.getPhoneRules();
    }
  }

  resetRuleNameField() {
    this.ruleSetName = '';
  }

  editAddressStandRule() {
    const dialogRef = this.dialog.open(AddressStandardComponent, {
      width: '800px',
      data: ''
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('close result', result);
      } else {

      }
    });
  }

  editNameStandRule() {
    const dialogRef = this.dialog.open(NameStandardComponent, {
      width: '800px',
      data: ''
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('close result', result);
      } else {

      }
    });
  }

}
