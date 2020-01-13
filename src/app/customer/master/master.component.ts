import { Component, OnInit, ViewChild, AfterViewInit, HostListener, AfterContentInit, OnChanges, SimpleChanges } from '@angular/core';
import { CustomerFields, FieldDataTypes } from '../models/customer';
import { StoreService } from '../services/store.service';
import { Rule, RuleType, RuleStatus, PhoneFormat, ReplaceDetail } from '../models/rule';
import { Router } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { AppConfigService } from 'src/app/app-config.service';
import { Helper } from '../helper';
import { HeaderService } from 'src/app/layout/services/header.service';
import { MatDialog } from '@angular/material/dialog';
import { ReplaceComponent } from '../replace/replace.component';
import { ExportHelper } from 'src/app/shared/helpers/exportHelper';

declare var toastr;

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit, AfterViewInit, AfterContentInit, OnChanges {

  @ViewChild('filterInput', { static: false }) filterInput;
  check = false;
  fileName = 'CustomerData';
  isShowHeaderMenu = false;
  hide = false;
  customerData = [];
  openFilter = false;
  ruleStatus = RuleStatus;
  columns: Array<any> = [];
  columnsToDisplay: Array<string> = [];
  dataset: any[] = [];
  masterData: any[] = [];
  filterData: any[] = [];
  rulesData: any[] = [];
  filterColumns: Array<any> = [];
  targetFields: Array<string> = [];
  allCustomerFields: Array<any> = [];
  defaultPageSize = 25;
  gridObj;
  dataViewObj;
  c = 1;
  updatedObject;
  pageSizes = [];
  currentPage = 1;
  totalFilteredRecords = 0;
  totalRecords = 0;
  totalPages;
  isConnected = false;
  status: string;
  rules: Array<Rule> = [];
  showHistory = false;
  customerSources: Array<any> = [];
  isFilterSet = false;
  showMenuForColumn;
  menuStyle = {};
  phoneformatEnum = PhoneFormat;
  filterText;
  windowWidth = 1100;
  showChildLeft = false;
  ruleCount: Array<any> = [];
  selectedPageSize = 'Show Records';
  pageDescription = ' Per Page';
  replaceData: ReplaceDetail = { isReplace: true, ignoreCase: true, replaceStr: '', replaceWith: '', matchExact: true };
  selectFiltersMain;
  isAssignedCols = false;
  sortCols: Array<any> = [];
  isLoading = false;
  editableColumn = {
    columnName: '',
    rowId: 0
  };
  constructor(
    public storeService: StoreService,
    protected headerService: HeaderService,
    protected appConfig: AppConfigService,
    private router: Router,
    private customerService: CustomerService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.pageSizes = this.appConfig.getConfig('pageSizes');
    this.storeService.getResetRules().subscribe(x => {
      if (x) {
        this.ResetRules();
      }
    });

    this.storeService.getRuleChanged().subscribe(flag => {
      if (localStorage.getItem('rules')) {
        this.rules = JSON.parse(localStorage.getItem('rules'));
      }

      this.ruleCount = JSON.parse(localStorage.getItem('rulesCount'));
      if (!this.ruleCount || this.ruleCount == null || this.ruleCount.length <= 0) {
        this.ruleCount = [];
      }
      if (!this.rules || this.rules == null || this.rules.length <= 0) {
        this.rules = [];
      }
    });
    this.headerService.setTitle('Customer Master Data');
    // this.loadData();
    this.storeService.getUserSettings().subscribe(x => {
      if (x && x != null) {
        this.allCustomerFields = x.filter(s => s.columnDbName != 'id');
        const userId = localStorage.getItem('userId');
        const assignedCols = x.filter(x => x.userEmailId ? x.userEmailId.toLowerCase : x.userEmailId == userId);
        this.isAssignedCols = (assignedCols && assignedCols.length > 0) ? true : false;
        console.log('in master isassigned cols', this.isAssignedCols);
        if (this.isAssignedCols) {
          this.defaultPageSize = assignedCols[0].defaultPageSize;
          console.log(' assignedCols[0].defaultPageSize', assignedCols[0].defaultPageSize);
        }
        console.log('this.defaultPageSize', this.defaultPageSize);
        this.targetFields = CustomerFields.getCustomerFields(this.allCustomerFields, true, false, false, this.isAssignedCols);
        this.loadGrid();
        this.loadData();
      }

    });
    this.storeService.getFieldCountKeys().subscribe(keys => {
    });
  }
  onExportDataClick() {
    const fullDate = new Date();
    const date = fullDate.getDate() + '-' + (fullDate.getMonth() + 1) + '-' + fullDate.getFullYear();
    const pgSize = this.appConfig.getConfig('exportFileChunkSize');
    let noData = false;
    if (this.totalFilteredRecords > pgSize) {
      toastr.info('Data size is too large Run Export job to export data');
    } else {
      let lastPage = 0;
      for (let pgNo = 0; ((pgNo * pgSize) <= this.totalFilteredRecords); pgNo++) {
        console.log('page No', pgNo);
        lastPage = pgNo;
        this.customerService.getCustomerDataFull(this.selectFiltersMain, pgSize, pgNo + 1).subscribe(d => {
          console.log('get data from service', d.customer);
          if (d.customer.length <= 0 && pgNo <= 0) {
            noData = true;
            toastr.info('No data exists for the selected filter');
            // return;
          } else {
            ExportHelper.exportToCsv(this.fileName + '_' + date + '_' + (pgNo + 1) + '.CSV', d.customer);
          }
        });
      }
      if (this.totalFilteredRecords > (lastPage * pgSize) && !noData) {
        this.customerService.getCustomerDataFull(this.selectFiltersMain, pgSize, lastPage + 2).subscribe(d => {
          console.log('get data from service', d);
          ExportHelper.exportToCsv(this.fileName + '_' + date + '_' + (lastPage + 2) + '.CSV', d.customer);
        });
      }
    }

  }
  onFilterChange(filter) {
    this.isLoading = true;
    this.storeService.resetCustomerFinalData();
    this.masterData = [];
    this.totalFilteredRecords = 0;
    this.totalRecords = 0;
    this.filterData = [];
    this.rulesData = [];
    this.dataset = [];
    this.selectFiltersMain = filter;
    if (this.selectFiltersMain) {
      this.loadData();
    }
  }
  ngAfterViewInit(): void {
    // if(this.filterInput) {
    console.log('this.filterInput', this.filterInput);
    // console.log('headerMenu', this.headerMenu);
    // const source = fromEvent(this.filterInput.nativeElement, 'keyup');
    // source.pipe(debounceTime(600)).subscribe(c => {
    //   this.addFilterColumn();
    //   this.setFilterRule();
    // });
    // console.log('document.getelementByid', document.getElementById('filterInput'));
    // const table = document.getElementById('customerTable');
  }
  ngAfterContentInit(): void {
    console.log('in after content init this.filterInput', this.filterInput);
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('in ng changes', changes);
  }
  onFilterInputChange(event) {
    console.log('in input change', this.filterText);
    // this.filterText = '';
    this.addFilterColumn();
    this.setFilterRule();
  }
  onfilterClick() {
    console.log('in filter click', this.filterInput);
    console.log('filterText', this.filterText);
    // const source = fromEvent(this.filterInput.nativeElement, 'keyup');
    // console.log('keyup', source);
    // //source.pipe(debounceTime(100)).subscribe(c => {
    // source.subscribe(c => {
    //   console.log('in subscribe', c);
    // this.filterText = '';
    // this.addFilterColumn();
    // this.setFilterRule();
    // event.stopPropagation();
  }
  @HostListener('document:click', ['$event'])
  onClick(e) {
    this.showMenuForColumn = '';
    if (this.isShowHeaderMenu) {
      this.isShowHeaderMenu = false;
    }
  }
  loadGrid() {
    this.setColumns();
  }
  getTotalRecords() {
    return this.totalRecords.toLocaleString('en-US');
  }
  getStartingRecord() {
    if (this.dataset.length == 0) {
      return 0;
    }
    return (this.currentPage * this.defaultPageSize) - this.defaultPageSize + 1;
  }
  getEndingRecord() {
    if (this.dataset.length == 0) {
      return 0;
    }
    if (this.currentPage == this.totalPages) {
      return this.totalRecords;
    }
    return (this.currentPage * this.defaultPageSize);
  }
  onReplaceClick(colName) {
    const isExistIndex = this.checkRuleExistByType_Col(colName, RuleType.replace);
    if (isExistIndex < 0) {
      this.isShowHeaderMenu = false;

      this.replaceData.isReplace = true;
      const dialogRef = this.dialog.open(ReplaceComponent, {
        width: '400px',
        data: this.replaceData
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.replaceData = result;
          this.addReplaceRule(colName, true);
        }
      });
    } else {
      toastr.info('Replace rule on ' + colName + ' already exists. Please remove rule to add again');
    }
  }

  onRemoveClick(colName) {
    const isExistIndex = this.checkRuleExistByType_Col(colName, RuleType.remove);
    if (isExistIndex < 0) {
      this.isShowHeaderMenu = false;
      this.replaceData.isReplace = false;
      const dialogRef = this.dialog.open(ReplaceComponent, {
        width: '400px',
        data: this.replaceData
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.replaceData = result;
          this.addReplaceRule(colName, false);
        }
      });
    } else {
      toastr.info('Remove rule on ' + colName + ' already exists. Please remove rule to add again.');
    }
  }
  addReplaceRule(colId, isReplace) {
    if (this.replaceData && this.replaceData.replaceStr) {
      const currentField = this.allCustomerFields.find(x => x.columnDbName == colId);
      const currentRule = Helper.getRuleObject(
        this.allCustomerFields,
        currentField.columnDbName,
        (isReplace ? RuleType.replace : RuleType.remove), this.replaceData.replaceStr, this.replaceData.replaceWith);
      this.rules.push(currentRule);
      localStorage.setItem('rules', JSON.stringify(this.rules));
      this.storeService.setRuleChanged(true);
      if (this.rules.length === 1) {
        this.showHistory = !this.showHistory;
      }
      let replaceStrRegEx;
      if (this.replaceData.matchExact) {
        replaceStrRegEx = new RegExp('\\b(?:' + this.replaceData.replaceStr + ')\\b', 'ig');
      } else {
        replaceStrRegEx = new RegExp('(?:' + this.replaceData.replaceStr + ')', 'ig');
      }

      this.filterData.forEach(d =>
        (d[colId] = (d[colId] != null && d[colId] != '') ? d[colId].replace(replaceStrRegEx, this.replaceData.replaceWith) : d[colId]));
     this.rulesData.forEach(d =>
        (d[colId] = (d[colId] != null && d[colId] != '') ? d[colId].replace(replaceStrRegEx, this.replaceData.replaceWith) : d[colId]));
      this.refreshGrid(this.isFilterSet ? this.filterData : this.rulesData);
      this.clearReplace();
    }
  }
  clearReplace() {
    this.replaceData = { isReplace: true, ignoreCase: true, replaceStr: '', replaceWith: '', matchExact: true };
  }
  addRemoveSpecialCharRule(colId) {
    this.isShowHeaderMenu = false;
    const isExistIndex = this.checkRuleExistByType_Col(colId, RuleType.removeSpecialCharacters);
    if (isExistIndex < 0) {
      const currentField = this.allCustomerFields.find(x => x.columnDbName == colId);
      const currentRule = Helper.getRuleObject(
        this.allCustomerFields,
        currentField.columnDbName,
        RuleType.removeSpecialCharacters, '', '', this.appConfig.getConfig('specialCharacters'));
      this.rules.push(currentRule);
      localStorage.setItem('rules', JSON.stringify(this.rules));
      this.storeService.setRuleChanged(true);
      const specialChars = this.appConfig.getConfig('specialCharacters').split(',');
      this.filterData.forEach(d => {
        specialChars.forEach(char => {
          d[colId] = (d[colId] != null && d[colId] != '') ? d[colId].split(char).join('') : d[colId];
        });
      });
      this.rulesData.forEach(d => {
        specialChars.forEach(char => {
          d[colId] = (d[colId] != null && d[colId] != '') ? d[colId].split(char).join('') : d[colId];
        });
      });
      this.refreshGrid(this.isFilterSet ? this.filterData : this.rulesData);
    } else {
      toastr.info('Remove special characters rule on ' + colId + ' already exists. Please remove rule to add again.');
    }
  }
  addTrimRule(colId) {
    this.isShowHeaderMenu = false;
    const isExistIndex = this.checkRuleExistByType_Col(colId, RuleType.trim);

    if (isExistIndex < 0) {// if rule not alerady added
      const currentField = this.allCustomerFields.find(x => x.columnDbName == colId);
      const currentRule = Helper.getRuleObject(this.allCustomerFields, currentField.columnDbName, RuleType.trim, '', '');
      this.rules.push(currentRule);
      localStorage.setItem('rules', JSON.stringify(this.rules));
      this.storeService.setRuleChanged(true);
      this.filterData.forEach(d => (d[colId] = (d[colId] != null && d[colId] != '') ? d[colId].trim() : d[colId]));
      this.rulesData.forEach(d => (d[colId] = (d[colId] != null && d[colId] != '') ? d[colId].trim() : d[colId]));
      this.refreshGrid(this.isFilterSet ? this.filterData : this.rulesData);
    } else {
      toastr.info('Trim rule on ' + colId + ' already exists. Please remove rule to add again.');
    }
  }
  addToLowerRule(colId) {
    this.isShowHeaderMenu = false;
    this.checkRuleExistC(colId);
    const currentField = this.allCustomerFields.find(x => x.columnDbName == colId);
    const currentRule = Helper.getRuleObject(this.allCustomerFields, currentField.columnDbName, RuleType.toLower, '', '');
    this.rules.push(currentRule);

    localStorage.setItem('rules', JSON.stringify(this.rules));
    this.storeService.setRuleChanged(true);
    this.filterData.forEach(d => (d[colId] = (d[colId] != null && d[colId] != '') ? d[colId].toLowerCase() : d[colId]));
    this.rulesData.forEach(d => (d[colId] = (d[colId] != null && d[colId] != '') ? d[colId].toLowerCase() : d[colId]));
    this.refreshGrid(this.isFilterSet ? this.filterData : this.rulesData);
  }
  addToUpperRule(colId) {
    this.isShowHeaderMenu = false;
    this.checkRuleExistC(colId);
    const currentField = this.allCustomerFields.find(x => x.columnDbName == colId);
    const currentRule = Helper.getRuleObject(this.allCustomerFields, currentField.columnDbName, RuleType.toUpper, '', '');
    this.rules.push(currentRule);
    localStorage.setItem('rules', JSON.stringify(this.rules));
    this.storeService.setRuleChanged(true);
    this.filterData.forEach(d => (d[colId] = (d[colId] != null && d[colId] != '') ? d[colId].toUpperCase() : d[colId]));
    this.rulesData.forEach(d => (d[colId] = (d[colId] != null && d[colId] != '') ? d[colId].toUpperCase() : d[colId]));
    this.refreshGrid(this.isFilterSet ? this.filterData : this.rulesData);
  }
  addToTitleCaseRule(colId) {
    this.isShowHeaderMenu = false;
    this.checkRuleExistC(colId);
    const currentField = this.allCustomerFields.find(x => x.columnDbName == colId);
    const currentRule = Helper.getRuleObject(this.allCustomerFields, currentField.columnDbName, RuleType.toTitleCase, '', '');
    this.rules.push(currentRule);
    localStorage.setItem('rules', JSON.stringify(this.rules));
    this.storeService.setRuleChanged(true);
    this.filterData.forEach(d => (d[colId] = (d[colId] != null && d[colId] != '') ? this.toTitleCase(d[colId]) : d[colId]));
    this.rulesData.forEach(d => (d[colId] = (d[colId] != null && d[colId] != '') ? this.toTitleCase(d[colId]) : d[colId]));
    this.refreshGrid(this.isFilterSet ? this.filterData : this.rulesData);
  }
  addToCamelCaseRule(colId) {
    this.isShowHeaderMenu = false;
    this.checkRuleExistC(colId);
    const currentField = this.allCustomerFields.find(x => x.columnDbName == colId);
    const currentRule = Helper.getRuleObject(this.allCustomerFields, currentField.columnDbName, RuleType.toTitleCase, '', '');
    this.rules.push(currentRule);
    localStorage.setItem('rules', JSON.stringify(this.rules));
    this.storeService.setRuleChanged(true);
    this.filterData.forEach(d => (d[colId] = (d[colId] != null && d[colId] != '') ? this.toCamelCase(d[colId]) : d[colId]));
    this.rulesData.forEach(d => (d[colId] = (d[colId] != null && d[colId] != '') ? this.toCamelCase(d[colId]) : d[colId]));
    this.refreshGrid(this.isFilterSet ? this.filterData : this.rulesData);

  }
  isAsc(colId) {
    const existingSortIndex = this.sortCols.findIndex(x => x.column == colId);
    if (existingSortIndex >= 0) {
      return this.sortCols[existingSortIndex].direction === 'asc' ? 1 : 0;
    }
    return 2;
  }
  onSort(event, colId) {
    this.showMenuForColumn = '';
    const existingSortIndex = this.sortCols.findIndex(x => x.column == colId);
    let dir = 'asc'; // : 'desc';
    console.log('existingSortIndex', existingSortIndex);
    if (existingSortIndex >= 0) {
      dir = this.sortCols[existingSortIndex].direction == 'asc' ? 'desc' : 'asc';
      console.log('dir', dir);
      this.sortCols[existingSortIndex].direction = dir;
    } else {
      this.sortCols = [];
      this.sortCols.push({ column: colId, direction: dir });
    }
    console.log('this.sortCols', this.sortCols);
    event.stopPropagation();
    this.applySortRule(colId, dir);
  }
  applySortRule(colName, dir) {
    this.filterData.sort(Helper.compareValues(colName, dir));
    this.rulesData.sort(Helper.compareValues(colName, dir));
    this.refreshGrid(this.isFilterSet ? this.filterData : this.rulesData);
  }
  addFormatPhone(colId, format) {
    this.isShowHeaderMenu = false;
    this.checkRuleExistPhoneFormat(colId);
    const currentField = this.allCustomerFields.find(x => x.columnDbName == colId);
    let ruleType = RuleType.formatPhone_WithBrackets;
    switch (format) {
      case PhoneFormat.Space:
        ruleType = RuleType.formatPhone_withSpaces;
        break;
      case PhoneFormat.Hyphen:
        ruleType = RuleType.formatPhone_WithHyphen;
        break;
      default:
        ruleType = RuleType.formatPhone_WithBrackets;
        break;
    }
    const currentRule = Helper.getRuleObject(
      this.allCustomerFields,
      currentField.columnDbName,
      ruleType, Helper.getPhoneFormatValue(format), '');
    this.rules.push(currentRule);
    localStorage.setItem('rules', JSON.stringify(this.rules));
    this.storeService.setRuleChanged(true);
    if (format == PhoneFormat.Bracket) {
      this.filterData.forEach(d => (d[colId] = Helper.formatPhoneNumber_withBrackets(d[colId])));
      this.rulesData.forEach(d => (d[colId] = Helper.formatPhoneNumber_withBrackets(d[colId])));
    } else if (format == PhoneFormat.Hyphen) {
      this.filterData.forEach(d => (d[colId] = Helper.formatPhoneNumber_withHyphen(d[colId])));
      this.rulesData.forEach(d => (d[colId] = Helper.formatPhoneNumber_withHyphen(d[colId])));
    } else if (format == PhoneFormat.Space) {
      this.filterData.forEach(d => (d[colId] = Helper.formatPhoneNumber_withSpace(d[colId])));
      this.rulesData.forEach(d => (d[colId] = Helper.formatPhoneNumber_withSpace(d[colId])));
    }
    this.refreshGrid(this.isFilterSet ? this.filterData : this.rulesData);
  }

  checkRuleExistByType_Col(colName, ruleType) {
    const index = this.rules.findIndex(x => x.ruleTypeId == ruleType && x.ruleColumn[0].columnDbName == colName);
    if (index >= 0) {
      return index;
    }
    return -1;
  }
  checkRuleExistC(colDbName) {
    let alreadyExist = false;
    let indexRem = 0;
    this.rules.forEach((r, indexR) => {
      if (
        r.ruleTypeId === RuleType.toLower ||
        r.ruleTypeId === RuleType.toUpper ||
        r.ruleTypeId === RuleType.toTitleCase
      ) {
        const index = r.ruleColumn.findIndex(c => c.columnDbName == colDbName);
        if (index >= 0) {
          indexRem = indexR;
          alreadyExist = true;
        }
      }
    });
    if (alreadyExist) {
      this.rules.splice(indexRem, 1);
    }
  }
  checkRuleExistPhoneFormat(colId) {
    const isExistIndex_WithBracket = this.rules.findIndex(r =>
      r.ruleTypeId === RuleType.formatPhone_WithBrackets &&
      r.ruleColumn[0].columnDbName == colId);
    const isExistIndex_WithSpace = this.rules.findIndex(r => r.ruleTypeId ===
      RuleType.formatPhone_withSpaces &&
      r.ruleColumn[0].columnDbName == colId);
    const isExistIndex_WithHyphen = this.rules.findIndex(r => r.ruleTypeId ===
      RuleType.formatPhone_WithHyphen && r.ruleColumn[0].columnDbName == colId);
    if (isExistIndex_WithBracket >= 0) {
      this.rules.splice(isExistIndex_WithBracket, 1);
    } else if (isExistIndex_WithSpace >= 0) {
      this.rules.splice(isExistIndex_WithSpace, 1);
    } else if (isExistIndex_WithHyphen >= 0) {
      this.rules.splice(isExistIndex_WithHyphen, 1);
    }
  }

  toTitleCase(txt): string {
    return (txt != null && txt != '') ? (txt.trim().charAt(0).toUpperCase() + txt.substr(1).toLowerCase()) : txt;
  }
  toCamelCase(txt): string {
    const arr = txt.split(' ');
    console.log('Array', arr);

    arr.forEach(word => {
      console.log('word lower case', word.trim().substr(1).toLowerCase());
      word = word.trim().charAt(0).toUpperCase() + word.trim().substr(1).toLowerCase();
    });
    console.log('Array AFTER CAMEL CASE', arr);
    const test = arr.join(' ');
    console.log('array join', test);
    // for (let i = 0; i < arr.lenght(); i++) {


    // }
    return test;
  }

  displaySpinner(flag) {
  }
  // getCustomerCallback(response) {
  //  // this.angularGrid.dataView.refresh();
  // }

  addFilterColumn() {
    // console.log('in add filter column', this.showMenuForColumn);
    // console.log('this.filterText', this.filterText);
    const val = this.filterText;
    const index = this.filterColumns.findIndex(x => x.columnDisplayName === this.showMenuForColumn);
    if (index >= 0) {
      this.filterColumns.splice(index, 1);
    }
    this.filterColumns.push({
      columnDisplayName: this.showMenuForColumn,
      ColumnValue: val
    });
    if (this.filterText.length > 0) {
      this.check = true;
      console.log('CHECK INNER', this.check);
    } else {
      this.check = false;
      console.log('CHECK INNER false', this.check);
    }
  }
  setFilterRule() {
    this.filterData = JSON.parse(JSON.stringify(this.rulesData));
    if (this.filterColumns && this.filterColumns.length > 0) {
      this.filterColumns.forEach(filter => {
        this.isFilterSet = true;
        this.filterData = this.filterData.filter(d => {
          const str = '' + d[filter.columnDisplayName];
          return str.toUpperCase().includes(filter.ColumnValue.toUpperCase());
        });
        this.refreshGrid(this.filterData);
      });
    } else {
      this.resetFilter();
    }
  }

  isDedupRuleAdded() {
    if (this.rules && this.rules != null && this.rules.length > 0) {
      const index = this.rules.findIndex(r => r.ruleTypeId == RuleType.deduplication);
      // const similarityIndex = this.rules.findIndex(r => r.ruleTypeId == RuleType.deduplication);
      if (index >= 0) {
        return true;
      }
    }
    return false;
  }
  isGoldenRuleAdded() {
    if (this.rules && this.rules != null && this.rules.length > 0) {
      const index = this.rules.findIndex(r => r.ruleTypeId == RuleType.goldenCustomer);
      if (index >= 0) {
        return true;
      }
    }
    return false;
  }
  removeRuleByType(ruleType) {
    const isexist = this.rules.filter(x => x.ruleTypeId == ruleType);
    const indexes = [];
    if (isexist && isexist.length > 0) {
      this.rules.forEach((rule, index, object) => {
        if (rule.ruleTypeId === ruleType) {
          indexes.push(index);
        }
      });
    }
    indexes.forEach(index => {
      this.rules.splice(index, 1);
    });
  }
  setColumns() {
    this.columns = CustomerFields.getColumns(this.allCustomerFields, this.isAssignedCols);
    this.columnsToDisplay = this.columns.map(column => column.id);
  }
  isPhoneColumn(showMenuForColumn) {
    const field = this.allCustomerFields.find(x => (x.columnDbName == showMenuForColumn));
    if (field && field.ruleDataType == FieldDataTypes.phone) {
      return true;
    }
    return false;
  }
  isDateColumn(column) {
    const field = this.allCustomerFields.find(x => (x.columnDbName == column));
    // console.log('FIELD', field);
    if (field && field.ruleDataType == 'datetime') {
      return true;
    }
    return false;
  }
  isStringColumn(showMenuForColumn) {
    const field = this.allCustomerFields.find(x => (x.columnDbName == showMenuForColumn));
    if (field && field.ruleDataType == FieldDataTypes.text) {
      return true;
    }
    return false;
  }
  isRuleColumn(showMenuForColumn) {
    const field = this.allCustomerFields.find(x => (x.columnDbName == showMenuForColumn));
    if (field && field.isRuleField) {
      return true;
    }
    return false;
  }
  loadData() {
    this.masterData = [];
    this.isLoading = true;
    this.storeService.getcustomerFinalData(this.selectFiltersMain).subscribe(d => {
      if (d && d != null) {
        this.masterData = d.customers;
        this.totalFilteredRecords = d.totalCount;
        this.totalRecords = this.masterData.length;
        this.filterData = JSON.parse(JSON.stringify(d.customers));
        this.rulesData = JSON.parse(JSON.stringify(d.customers));
        if (this.filterData && this.filterData != null) {
          this.totalPages = Math.ceil(this.filterData.length / this.defaultPageSize);
          const tempdata = JSON.parse(JSON.stringify(this.filterData));
          this.dataset = tempdata.splice(
            (this.currentPage - 1) * this.defaultPageSize,
            this.defaultPageSize
          );
          this.isLoading = false;
        }
      } else {
        // this.isLoading = false;
      }

    });
  }
  refreshGrid(currentDataSet) {
    if (currentDataSet && currentDataSet != null) {
      this.totalPages = Math.ceil(currentDataSet.length / this.defaultPageSize);
      const tempdata = JSON.parse(JSON.stringify(currentDataSet));
      this.dataset = tempdata.splice(
        (this.currentPage - 1) * this.defaultPageSize,
        this.currentPage * this.defaultPageSize
      );
      if (this.gridObj) {
        this.gridObj.invalidate();
        this.gridObj.render();
      }
    }
  }
  onHeaderClick(event, colId) {
    if (this.showMenuForColumn == colId) {
      this.showMenuForColumn = '';
      this.isShowHeaderMenu = false;
    } else {
      this.showMenuForColumn = colId;
      this.isShowHeaderMenu = true;
    }
    // const element = document.getElementById(colId);
    const oldFilter = this.filterColumns.filter(x => x.columnDisplayName == colId);
    console.log('old filter', oldFilter);
    console.log('All filter', this.filterColumns);
    if (oldFilter && oldFilter.length > 0) {
      this.filterText = oldFilter[0].ColumnValue;
    } else {
      this.filterText = '';
    }

    event.stopPropagation();
  }
  //#region paging
  pageChanged(event) {
    this.loadData();
  }
  onPageChangeClick(pgNo) {
    pgNo = Math.ceil(pgNo);
    if (pgNo <= 0 || pgNo > this.totalPages) {
      if (this.totalPages <= 0) {
        toastr.info('No data exists');
      } else {
        toastr.info('Please select page no between (1 - ' + this.totalPages + ')');
      }
    } else {
      this.currentPage = pgNo;
      this.loadData();
    }
  }
  onPageSizeChange() {
    this.loadData();
  }
  prevPageCLick() {
    this.currentPage = this.currentPage > 1 ? this.currentPage - 1 : this.currentPage;
    this.loadData();
  }
  nextPageCLick() {
    this.currentPage = this.currentPage < this.totalPages ? this.currentPage + 1 : this.currentPage;
    this.loadData();
  }
  firstPageCLick() {
    this.currentPage = 1;
    this.loadData();
  }
  lastPageCLick() {
    this.currentPage = this.totalPages;
    this.loadData();
  }
  //#endregion paging

  closeHistory() {
    this.showHistory = !this.showHistory;
  }
  onManualCustSelectField(event) {
    localStorage.setItem('ManualCustomerField', event.Column);
    this.router.navigate(['/customer/manualCust']);
  }

  onRuleSelect(rule, isSelected) {
    rule.isSelected = isSelected;
    rule.status = isSelected ? RuleStatus.Pending : rule.status;
  }
  onRemoveRule(rule) {
    const index = this.rules.indexOf(rule);
    if (index >= 0) {
      this.rules.splice(index, 1);
    }
  }
  onDedupeClick() {
    if (this.isDedupRuleAdded()) {
      toastr.info('Dedupe rule is already added. To change the rule, remove already added rule');
      return false;
    } else {
      this.router.navigate(['/customer/ruleEngine']);
    }
  }
  onGoldenRecordClick() {
    if (!this.isDedupRuleAdded()) {
      toastr.info('Kindly select dedupe grouping fields first');
      return false;
    } else if (this.isGoldenRuleAdded()) {
      toastr.info(
        'Golden Customer rule is already added. To change the rule, remove already added rule'
      );
      return false;
    } else {
      this.router.navigate(['/customer/goldenFull']);
    }
  }
  manualReviewClick() {
    this.router.navigate(['/customer/manual']);
  }
  resetFilter() {
    this.filterColumns = [];
    this.filterData = JSON.parse(JSON.stringify(this.rulesData));
    this.isFilterSet = false;
    this.refreshGrid(this.rulesData);
  }
  ResetRules() {
    this.resetFilter();
    this.filterData = JSON.parse(JSON.stringify(this.masterData));
    this.rulesData = JSON.parse(JSON.stringify(this.masterData));
    this.refreshGrid(this.rulesData);
    this.rules = [];
  }
  getRandom() {
    alert(Helper.getRandomNumber(100, 1000));
  }
  getExpectedCount(rule) {
    const index = this.ruleCount.findIndex(r => r.rule == rule);
    if (index >= 0) {
      return this.ruleCount[index].count;
    }
    return '55,432';
  }

  gridColumnSelected(columnName, row) {
    this.editableColumn.columnName = columnName;
    this.editableColumn.rowId = row.id;
  }

  updateGridColumnValue(columnName, row, updatedValue) {

  }

  resetGridColumnValue(event, columnName, row) {
    event.stopPropagation();
    this.editableColumn.rowId = 0;
    this.editableColumn.columnName = '';
  }
}
