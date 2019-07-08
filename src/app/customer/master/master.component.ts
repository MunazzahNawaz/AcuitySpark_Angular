import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import {
  Column,
  GridOption,
  GridOdataService,
  CaseType,
  AngularGridInstance,
  FieldType,
  Editors,
  DelimiterType,
  FileType,
  GridStateType,
  GridStateChange
} from 'angular-slickgrid';
import { Customer } from '../models/customer';
import { StoreService } from '../services/store.service';
// import { ElasticSearchService } from '../services/elastic-search.service';
import {
  Rule,
  MatchType,
  RuleType,
  RuleStatus,
  PhoneFormat
} from '../models/rule';
import { Router } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { AppConfigService } from 'src/app/app-config.service';
import { Helper } from '../helper';
import * as $ from 'jquery';
declare var toastr;

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit {
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  masterData: any[] = [];
  filterData: any[] = [];
  rulesData: any[] = [];
  targetFields: Array<string> = [];
  defaultPageSize = 25;
  angularGrid: AngularGridInstance;
  gridObj;
  dataViewObj;
  updatedObject;
  pageSizes = [10, 25, 50, 100];
  currentPage = 1;
  totalPages;
  isConnected = false;
  status: string;
  rules: Array<Rule> = [];
  showHistory = false;
  customerSources: Array<any> = [];
  isFilterSet = false;
  replaceColumn;
  replaceError='';
  replaceWithError='';
  @ViewChild('replaceModalBtn') openReplaceModal;
  @ViewChild('closeReplaceModal') closeReplaceModal;

  constructor(
    public storeService: StoreService,
    //  public es: ElasticSearchService,
    protected appConfig: AppConfigService,
    private router: Router,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.targetFields = Customer.getCustomerFields();
    this.loadGrid();
    this.storeService.getCustomerRules().subscribe(r => {
      this.rules = r;
      console.log('rules on master page', r);
    });
  }
  loadGrid() {
    this.setColumns();

    this.gridOptions = {
      editable: true,
      enableCellNavigation: true,
      autoEdit: false,
      enableAutoResize: true, // true by default
      autoHeight: false,
      enableFiltering: true,
      exportOptions: {
        delimiter: DelimiterType.comma,
        exportWithFormatter: false,
        filename: 'export',
        format: FileType.csv,
        groupingAggregatorRowText: '',
        sanitizeDataExport: false,
        useUtf8WithBom: true
      },
      showHeaderRow: false,
      forceFitColumns: false,
      gridMenu: {
        hideClearAllFiltersCommand: false,
        hideClearAllSortingCommand: false,
        hideExportCsvCommand: false,
        hideExportTextDelimitedCommand: true,
        hideForceFitButton: true,
        hideRefreshDatasetCommand: true,
        hideSyncResizeButton: true,
        hideToggleFilterCommand: false,
        hideTogglePreHeaderCommand: true,
        iconCssClass: 'fa fa-bars',
        iconClearAllFiltersCommand: 'fa fa-filter text-danger',
        iconClearAllSortingCommand: 'fa fa-unsorted text-danger',
        iconExportCsvCommand: 'fa fa-download',
        iconExportTextDelimitedCommand: 'fa fa-download',
        iconRefreshDatasetCommand: 'fa fa-refresh',
        iconToggleFilterCommand: 'fa fa-random',
        iconTogglePreHeaderCommand: 'fa fa-random',
        menuWidth: 16,
        resizeOnShowHeaderRow: true
      },
      headerMenu: {
        autoAlign: true,
        autoAlignOffset: 12,
        minWidth: 150,
        iconClearFilterCommand: 'fa fa-filter text-danger',
        iconClearSortCommand: 'fa fa-unsorted',
        iconSortAscCommand: 'fa fa-sort-amount-asc',
        iconSortDescCommand: 'fa fa-sort-amount-desc',
        iconColumnHideCommand: 'fa fa-times',
        hideColumnHideCommand: true,
        hideClearFilterCommand: false,
        hideClearSortCommand: false,
        hideSortCommands: false,
        onCommand: (e, args) => {
          console.log('e', e);
          console.log('args', args);
          if (args.command === 'replace') {
            this.replaceColumn = args.column.field;
            this.openReplaceModal.nativeElement.click();
          }
          if (args.command === 'trim') {
            this.addTrimRule(args.column.field);
          }
          if (args.command === 'toLower') {
            // alert('To Lower');
            this.addToLowerRule(args.column.field);
          }
          if (args.command === 'toTitleCase') {
            this.addToTitleCaseRule(args.column.field);
          }
          if (args.command === 'removeSpecialCharacters') {
            this.addRemoveSpecialCharRule(args.column.field);
          }
          if (args.command === 'toUpper') {
            this.addToUpperRule(args.column.field);
          }
          if (args.command === 'formatBracket') {
            this.addFormatPhone(args.column.field, PhoneFormat.Bracket);
          }
          if (args.command === 'formatHyphen') {
            this.addFormatPhone(args.column.field, PhoneFormat.Hyphen);
          }
          if (args.command === 'formatSpace') {
            this.addFormatPhone(args.column.field, PhoneFormat.Space);
          }
        }
      },
      enablePagination: false,
      backendServiceApi: {
        service: new GridOdataService(),
        // define all the on Event callbacks
        options: {
          caseType: CaseType.pascalCase,
          top: this.defaultPageSize
        },
        preProcess: () => this.displaySpinner(true),
        process: query => this.getCustomerApiCall(query),
        postProcess: response => {
          console.log(response);
          this.displaySpinner(false);
          this.getCustomerCallback(response);
        }
      },
      enableHeaderMenu: true
    };
  }
  addReplaceRule(colName) {
    this.rules.push({
      type: RuleType.replace,
      columns: [{ ColumnName: colName, ColumnValue: '' }],
      detail: 'Replace abc with xyz in ' + colName,
      status: RuleStatus.Pending,
      isSelected: true,
      sortColumn: ''
    });
    // this.dataset.map(d => (d[colName] = d[colName].trim()));
    // this.gridObj.invalidate();
    // this.gridObj.render();
  }
  addRemoveSpecialCharRule(colName) {
    this.rules.push({
      type: RuleType.trim,
      columns: [{ ColumnName: colName, ColumnValue: '' }],
      detail:
        'Remove special characters (' +
        this.appConfig.getConfig('specialCharacters') +
        ') from ' +
        colName,
      status: RuleStatus.Pending,
      isSelected: true,
      sortColumn: ''
    });

    const specialChars = this.appConfig
      .getConfig('specialCharacters')
      .split(',');
    console.log('specialChars', specialChars);
    this.filterData.map(d => {
      specialChars.forEach(char => {
        d[colName] = d[colName].replace(char, '');
      });
    });
    this.rulesData.map(d => {
      specialChars.forEach(char => {
        d[colName] = d[colName].replace(char, '');
      });
    });
    this.refreshGrid(this.isFilterSet ? this.filterData : this.rulesData);
  }
  addTrimRule(colName) {
    this.rules.push({
      type: RuleType.trim,
      columns: [{ ColumnName: colName, ColumnValue: '' }],
      detail: 'Trim ' + colName,
      status: RuleStatus.Pending,
      isSelected: true,
      sortColumn: ''
    });
    this.filterData.map(d => (d[colName] = d[colName].trim()));
    this.rulesData.map(d => (d[colName] = d[colName].trim()));
    this.refreshGrid(this.isFilterSet ? this.filterData : this.rulesData);
  }
  addToLowerRule(colName) {
    this.checkRuleExistC(colName);
    this.rules.push({
      type: RuleType.toLower,
      columns: [{ ColumnName: colName, ColumnValue: '' }],
      detail: 'Change ' + colName + ' to Lower case',
      status: RuleStatus.Pending,
      isSelected: true,
      sortColumn: ''
    });
    this.filterData.map(d => (d[colName] = d[colName].toLowerCase()));
    this.rulesData.map(d => (d[colName] = d[colName].toLowerCase()));
    this.refreshGrid(this.isFilterSet ? this.filterData : this.rulesData);
  }
  addToUpperRule(colName) {
    this.checkRuleExistC(colName);
    this.rules.push({
      type: RuleType.toUpper,
      columns: [{ ColumnName: colName, ColumnValue: '' }],
      detail: 'Change ' + colName + ' to Upper case',
      status: RuleStatus.Pending,
      isSelected: true,
      sortColumn: ''
    });
    this.filterData.map(d => (d[colName] = d[colName].toUpperCase()));
    this.rulesData.map(d => (d[colName] = d[colName].toUpperCase()));
    console.log('this.isFilterSet', this.isFilterSet);
    this.refreshGrid(this.isFilterSet ? this.filterData : this.rulesData);
  }
  addToTitleCaseRule(colName) {
    this.checkRuleExistC(colName);
    this.rules.push({
      type: RuleType.toTitleCase,
      columns: [{ ColumnName: colName, ColumnValue: '' }],
      detail: 'Change ' + colName + ' to Title case',
      status: RuleStatus.Pending,
      isSelected: true,
      sortColumn: ''
    });
    console.log(this.rules);
    this.filterData.map(d => (d[colName] = this.toTitleCase(d[colName])));
    this.rulesData.map(d => (d[colName] = this.toTitleCase(d[colName])));
    this.refreshGrid(this.isFilterSet ? this.filterData : this.rulesData);
  }
  replaceWordRule(replace, replaceWith)
  {
    if(replace && replaceWith)
    {
      this.rules.push({
        type: RuleType.replace,
        columns: [{ ColumnName: this.replaceColumn, ColumnValue: replace, ReplaceWith: replaceWith }],
        detail: 'Replace Rule applied on' +this.replaceColumn ,
        status: RuleStatus.Pending,
        isSelected: true,
        sortColumn: ''
      });
      console.log(this.rules);
      this.closeReplaceModal.nativeElement.click();
    }
    else
    {
      if(replace == '')
      {
        this.replaceError = 'Provide the word to be replaced';
      }
      if(replaceWith == '')
      {
        this.replaceWithError = 'Provide the word to be replaced with';
      }
    }
  }
  applySortRule(colName, dir) {
    console.log(this.rules);
    this.filterData.sort(Helper.compareValues(colName, dir));
    this.rulesData.sort(Helper.compareValues(colName, dir));
    this.refreshGrid(this.isFilterSet ? this.filterData : this.rulesData);
  }
  addFormatPhone(colName, format) {
    this.checkRuleExistPhoneFormat();
    this.rules.push({
      type: RuleType.formatPhone,
      columns: [{ ColumnName: colName, ColumnValue: format }],
      detail: 'Format ' + colName,
      status: RuleStatus.Pending,
      isSelected: true,
      sortColumn: ''
    });
    console.log(this.rules);
    if (format == PhoneFormat.Bracket) {
      this.filterData.map(
        d => (d[colName] = Helper.formatPhoneNumber_withBrackets(d[colName]))
      );
      this.rulesData.map(
        d => (d[colName] = Helper.formatPhoneNumber_withBrackets(d[colName]))
      );
    } else if (format == PhoneFormat.Hyphen) {
      this.filterData.map(
        d => (d[colName] = Helper.formatPhoneNumber_withHyphen(d[colName]))
      );
      this.rulesData.map(
        d => (d[colName] = Helper.formatPhoneNumber_withHyphen(d[colName]))
      );
    } else if (format == PhoneFormat.Space) {
      this.filterData.map(
        d => (d[colName] = Helper.formatPhoneNumber_withSpace(d[colName]))
      );
      this.rulesData.map(
        d => (d[colName] = Helper.formatPhoneNumber_withSpace(d[colName]))
      );
    }
    console.log('rulesData', this.rulesData);
    this.refreshGrid(this.isFilterSet ? this.filterData : this.rulesData);
  }

  checkRuleExistC(colName) {
    let alreadyExist = false;
    let indexRem = 0;
    this.rules.forEach((r, indexR) => {
      if (
        r.type === RuleType.toLower ||
        r.type === RuleType.toUpper ||
        r.type === RuleType.toTitleCase
      ) {
        const index = r.columns.findIndex(c => c.ColumnName == colName);
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
  checkRuleExistPhoneFormat() {
    const isExistIndex = this.rules.findIndex(
      r => r.type === RuleType.formatPhone
    );
    if (isExistIndex >= 0) {
      this.rules.splice(isExistIndex, 1);
    }

    // let alreadyExist = false;
    // let indexRem = 0;
    // this.rules.forEach( (r, indexR) => {
    //   if (r.type === RuleType.toLower || r.type === RuleType.toUpper || r.type === RuleType.toTitleCase) {
    //     const index = r.columns.findIndex(c => c.ColumnName == colName);
    //     if (index >= 0) {
    //       indexRem = indexR;
    //       alreadyExist = true;
    //     }
    //   }
    // });
    // if (alreadyExist) {
    //   this.rules.splice(indexRem, 1);
    // }
  }

  toTitleCase(txt): string {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  }
  displaySpinner(flag) {
    console.log('display spinner', flag);
  }
  getCustomerCallback(response) {
    this.angularGrid.dataView.refresh();
  }
  // Web API call
  // getCustomerApiCall(odataQuery) {
  //   console.log('odataQuery', odataQuery);
  //   if (odataQuery.indexOf('$filter=') >= 0) {
  //     this.setFilterRule(odataQuery);
  //   }

  //   return this.storeService.getcustomerFinalData();
  // }

  getCustomerApiCall(odataQuery) {
    console.log('odataQuery', odataQuery);
    if (odataQuery.indexOf('$filter=') >= 0) {
      this.setFilterRule(odataQuery);
    } else {
      this.resetFilter();
    }
    // fill the template on async delay
    return new Promise(resolve => {
      resolve(this.masterData);
    });
  }

  setFilterRule(odataQuery) {
    console.log('odataQuery', odataQuery);
    const filterString = odataQuery.substring(odataQuery.indexOf('$filter='));
    console.log('filterString', filterString);
    this.filterData = JSON.parse(JSON.stringify(this.rulesData));
    if (filterString && filterString.length > 0) {
      const filterArray = filterString
        .replace('$filter=(', '')
        .split('substringof');
      this.removeRuleByType(RuleType.filter);

      filterArray.forEach(filter => {
        if (filter.length > 0) {
          this.isFilterSet = true;
          const colName = filter
            .substring(filter.indexOf(',') + 1, filter.indexOf(')'))
            .trim();
          const colValue = filter
            .substring(filter.indexOf('(') + 2, filter.indexOf(',') - 1)
            .trim();

          // if (this.rules.length <= 0) {
          //   this.showHistory = true;
          // }
          // this.rules.push({
          //   type: RuleType.filter,
          //   columns: [{ ColumnName: colName, ColumnValue: colValue }],
          //   detail: 'Filter ' + colName + ' on ' + colValue,
          //   status: RuleStatus.Pending,
          //   isSelected: true,
          //   sortColumn: ''
          // });
          //  this.dataset.map(d => (d[colName] = this.toTitleCase(d[colName])));

          // this.dataset = filterDataSet.filter(d =>
          //   d[colName] === colValue
          // );

          this.filterData = this.filterData.filter(d => {
            // evaluate eval.shielded === false and do nothing with the result
            let str = d[colName];
            // console.log('str.includes(T)',str.includes('T'));
            // console.log('str', str);
            console.log('colValue', colValue);
            return str.toUpperCase().includes(colValue.toUpperCase());
          });
          this.refreshGrid(this.filterData);
          // this.gridObj.invalidate();
          // this.gridObj.render();
        }
      });
      console.log('rules in ODATA', this.rules);
    } else {
      this.resetFilter();
    }
  }
  isDedupRuleAdded() {
    const index = this.rules.findIndex(
      r => r.type == RuleType.deduplicateExact
    );
    const similarityIndex = this.rules.findIndex(
      r => r.type == RuleType.deduplicateSimilarity
    );
    if (index >= 0 || similarityIndex >= 0) {
      return true;
    }
    return false;
  }
  isGoldenRuleAdded() {
    const index = this.rules.findIndex(r => r.type == RuleType.goldenCustomer);
    if (index >= 0) {
      return true;
    }
    return false;
  }
  removeRuleByType(ruleType) {
    console.log('rules before splice', this.rules);
    const isexist = this.rules.filter(x => x.type == ruleType);
    // console.log('remove rule',this.rules.filter(x => x.type == ruleNumber));
    console.log('isexist', isexist);
    const indexes = [];
    if (isexist && isexist.length > 0) {
      this.rules.forEach((rule, index, object) => {
        console.log('object before splice', object, index);
        if (rule.type === ruleType) {
          indexes.push(index);
        }
      });
    }
    indexes.forEach(index => {
      this.rules.splice(index, 1);
    });
    console.log('rules after splice', this.rules);
  }
  setColumns() {
    this.targetFields.forEach(col => {
      this.columnDefinitions.push({
        id: col,
        name: col,
        //   name:
        //     col +
        //     `<div class="dropdown">
        //   <button class="dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        //    o
        //   </button>
        //   <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        //     <a class="dropdown-item" href="#">Action</a>
        //     <a class="dropdown-item" href="#">Another action</a>
        //     <a class="dropdown-item" href="#">Something else here</a>
        //   </div>
        // </div>`,
        field: col,
        sortable: true,
        filterable: true,
        type: FieldType.string,
        editor: { model: Editors.text },
        minWidth: 150
      });
    });
    // this.columnDefinitions.push({
    //   id: this.targetFields[0],
    //   name: 'Customer No',
    //   field: this.targetFields[0],
    //   sortable: true,
    //   filterable: true,
    //   type: FieldType.string,
    //   editor: { model: Editors.text },
    //   minWidth: 150
    // });
    // this.columnDefinitions.push({
    //   id: this.targetFields[1],
    //   name: 'First Name',
    //   field: this.targetFields[1],
    //   sortable: true,
    //   filterable: true,
    //   type: FieldType.string,
    //   editor: { model: Editors.text },
    //   minWidth: 150
    // });
    // this.columnDefinitions.push({
    //   id: this.targetFields[2],
    //   name: 'Last Name',
    //   field: this.targetFields[2],
    //   sortable: true,
    //   filterable: true,
    //   type: FieldType.string,
    //   editor: { model: Editors.text },
    //   minWidth: 150
    // });
    // this.columnDefinitions.push({
    //   id: this.targetFields[3],
    //   name: 'Email',
    //   field: this.targetFields[3],
    //   sortable: true,
    //   filterable: true,
    //   type: FieldType.string,
    //   editor: { model: Editors.text },
    //   minWidth: 150
    // });
    // this.columnDefinitions.push({
    //   id: this.targetFields[4],
    //   name: 'Shipping Address',
    //   field: this.targetFields[4],
    //   sortable: true,
    //   filterable: true,
    //   type: FieldType.string,
    //   editor: { model: Editors.text },
    //   minWidth: 170
    // });
    // this.columnDefinitions.push({
    //   id: this.targetFields[5],
    //   name: 'Phone',
    //   field: this.targetFields[5],
    //   sortable: true,
    //   filterable: true,
    //   type: FieldType.string,
    //   editor: { model: Editors.text },
    //   minWidth: 150
    // });
    // this.columnDefinitions.push({
    //   id: this.targetFields[6],
    //   name: 'Zip',
    //   field: this.targetFields[6],
    //   sortable: true,
    //   filterable: true,
    //   type: FieldType.string,
    //   editor: { model: Editors.text },
    //   minWidth: 150
    // });
    // this.columnDefinitions.push({
    //   id: this.targetFields[7],
    //   name: 'Country',
    //   field: this.targetFields[7],
    //   sortable: true,
    //   filterable: true,
    //   type: FieldType.string,
    //   editor: { model: Editors.text },
    //   minWidth: 150
    // });
    // this.columnDefinitions.push({
    //   id: this.targetFields[8],
    //   name: 'City',
    //   field: this.targetFields[8],
    //   sortable: true,
    //   filterable: true,
    //   type: FieldType.string,
    //   editor: { model: Editors.text },
    //   minWidth: 150
    // });
    // this.columnDefinitions.push({
    //   id: this.targetFields[9],
    //   name: 'State',
    //   field: this.targetFields[9],
    //   sortable: true,
    //   filterable: true,
    //   type: FieldType.string,
    //   editor: { model: Editors.text },
    //   minWidth: 120
    // });
    // this.columnDefinitions.push({
    //   id: this.targetFields[10],
    //   name: 'Country',
    //   field: this.targetFields[10],
    //   sortable: true,
    //   filterable: true,
    //   type: FieldType.string,
    //   editor: { model: Editors.text },
    //   minWidth: 120
    // });
    console.log('column definitions', this.columnDefinitions);
    this.columnDefinitions.forEach(columnDef => {
      columnDef.header = {
        menu: {
          items: [
            {
              iconCssClass: 'fa fa-repeat',
              disabled: columnDef.id === 'Phone', // you can disable a command with certain logic
              titleKey: 'Replace', // use "title" as plain string OR "titleKey" when using a translation key
              command: 'replace',
              positionOrder: 3
            },
            {
              iconCssClass: 'fa fa-scissors',
              disabled: columnDef.id === 'Phone', // you can disable a command with certain logic
              titleKey: 'Trim', // use "title" as plain string OR "titleKey" when using a translation key
              command: 'trim',
              positionOrder: 4
            },
            {
              iconCssClass: 'fa fa-level-up',
              disabled: columnDef.id === 'Phone', // you can disable a command with certain logic
              titleKey: 'To Upper Case', // use "title" as plain string OR "titleKey" when using a translation key
              command: 'toUpper',
              positionOrder: 5
            },
            {
              iconCssClass: 'fa fa-level-down',
              disabled: columnDef.id === 'Phone', // you can disable a command with certain logic
              titleKey: 'To Lower Case', // use "title" as plain string OR "titleKey" when using a translation key
              command: 'toLower',
              positionOrder: 6
            },
            {
              iconCssClass: 'fa fa-text-height',
              disabled: columnDef.id === 'Phone', // you can disable a command with certain logic
              titleKey: 'To Title Case', // use "title" as plain string OR "titleKey" when using a translation key
              command: 'toTitleCase',
              positionOrder: 7
            },
            {
              iconCssClass: 'fa fa-eraser',
              disabled: columnDef.id === 'Phone', // you can disable a command with certain logic
              titleKey: 'Remove Special Characters', // use "title" as plain string OR "titleKey" when using a translation key
              command: 'removeSpecialCharacters',
              positionOrder: 8
            }
            // ,
            // // you can also add divider between commands (command is a required property but you can set it to empty string)
            // {
            //   divider: true,
            //   command: '',
            //   positionOrder: 98
            // }
          ]
        }
      };
    });
    this.columnDefinitions[5].header = {
      menu: {
        items: [
          {
            iconCssClass: 'fa fa-align-center',
            titleKey: 'Format (973) 517 5612', // use "title" as plain string OR "titleKey" when using a translation key
            command: 'formatBracket',
            positionOrder: 100
          },
          {
            iconCssClass: 'fa fa-align-center',
            titleKey: 'Format 973-517-5612', // use "title" as plain string OR "titleKey" when using a translation key
            command: 'formatHyphen',
            positionOrder: 100
          },
          {
            iconCssClass: 'fa fa-align-center',
            titleKey: 'Format 973 5175612', // use "title" as plain string OR "titleKey" when using a translation key
            command: 'formatSpace',
            positionOrder: 100
          }
        ]
      }
    };
  }
  loadData() {
    this.masterData = [];
    // customerSource._source

    this.storeService.getcustomerFinalData().subscribe(d => {
      console.log('get data from service', d);
      if (d && d != null) {
        this.masterData = d;
        this.filterData = JSON.parse(JSON.stringify(d));
        this.rulesData = JSON.parse(JSON.stringify(d));
        if (this.filterData && this.filterData != null) {
          this.totalPages = Math.ceil(
            this.filterData.length / this.defaultPageSize
          );
          const tempdata = JSON.parse(JSON.stringify(this.filterData));
          this.dataset = tempdata.splice(
            (this.currentPage - 1) * this.defaultPageSize,
            this.currentPage * this.defaultPageSize
          );
        }
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
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.angularGrid.gridStateService.onGridStateChanged.subscribe(
      (data: GridStateChange) => {
        //   console.log('state change', data);
        this.gridStateChanged(data);
      }
    );
    // the Angular Grid Instance exposes both Slick Grid & DataView objects
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
    // this.gridObj.setSortColumn(AppConfig.defaultSortColumn, true);
    // it also exposes all the Services
    // this.angularGrid.resizerService.resizeGrid(10);
  }
  onHeaderContextMenu(e, args) {
    console.log('args on header context', args);
  }
  onHeaderCellRendered(e, args) {
    console.log('args on header click', args);

    // $(args.node).empty();
let left = args.node.offsetLeft;
let top = args.node.offsetHeight;
let style = 'min-width: 150px; top: '+ top+'px; left: '+left+'px;';
   console.log('left', left);
   console.log('offsetLeft', args.node.offsetLeft);
let html  =`<div class="slick-header-menu" style="`+ style+`">
<div class="slick-header-menuitem"> 
<div class="dropdown">
        <button class="dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    o
   </button>
   <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
     <a class="dropdown-item" href="#">`+args.column.id+`</a>
     <a class="dropdown-item" href="#">Another action</a>
     <a class="dropdown-item" href="#">Something else here</a></div></div>
  </div></div>`;
    $(html)
      .data('columnId', args.column.id)
      .val('')
      .appendTo(args.node.offsetParent.offsetParent.offsetParent.offsetParent);

    // $(
    //   `<select style='width: 70px;'>
    //   <option value=''>All</option>
    //   <option value='Activation'>Activation</option>
    //   <option value='Deactivation'>Deactivation</option>
    //   <option value='Upload'>Upload</option></select>`
    // )

  }
  onCellChanged(e, args) {
    // this.updatedObject = args.item;
    // this.angularGrid.resizerService.resizeGrid(10);
    console.log('onCellChanged', args);
  }
  gridStateChanged(e) {
    console.log('grid state', e);

    switch (e.change.type) {
      case GridStateType.sorter:
        console.log('sorting change');
        // if (this.rules && this.rules.length <= 0) {
        //   this.showHistory = true;
        // }
        // this.removeRuleByType(RuleType.sorter);
        // console.log('e.gridState.sorters', e.gridState.sorters);
        // if (e.gridState.sorters && e.gridState.sorters.length > 0) {
        //   this.rules.push({
        //     type: RuleType.sorter,
        //     columns: [
        //       {
        //         ColumnName: e.gridState.sorters[0].columnId,
        //         ColumnValue: e.gridState.sorters[0].direction
        //       }
        //     ],
        //     detail:
        //       'Sort ' +
        //       e.gridState.sorters[0].columnId +
        //       ' ' +
        //       e.gridState.sorters[0].direction,
        //     status: RuleStatus.Pending,
        //     isSelected: true,
        //     sortColumn: ''
        //   });
        // }

        this.applySortRule(
          e.gridState.sorters[0].columnId,
          e.gridState.sorters[0].direction
        );
        break;

      case GridStateType.pagination:
        console.log('pagination change');
        break;

      case GridStateType.filter:
        console.log('filter change');
        this.removeRuleByType(RuleType.filter);
        break;

      case GridStateType.columns:
        console.log('columns change');
        break;

      default:
        console.log('other change');
    }

    console.log('rules in grid state change', this.rules);
  }

  onCellClicked(e, args) {
    console.log('onCellClicked', args);
  }

  //#region paging
  onPageSizeChange(pageSize) {
    console.log('pageSize', pageSize);
    this.defaultPageSize = pageSize;
    this.loadData();
  }
  prevPageCLick() {
    this.currentPage =
      this.currentPage > 1 ? this.currentPage - 1 : this.currentPage;
    console.log('prev Click currentPage', this.currentPage);
    console.log('prev Click defaultPageSize', this.defaultPageSize);
    console.log('totalPages', this.totalPages);
    this.loadData();
  }
  nextPageCLick() {
    this.currentPage =
      this.currentPage < this.totalPages
        ? this.currentPage + 1
        : this.currentPage;
    console.log('totalPages', this.totalPages);
    console.log('prev Click currentPage', this.currentPage);
    console.log('prev Click defaultPageSize', this.defaultPageSize);
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

  onExportClick() {
    // const gridState: GridState = this.angularGrid.gridStateService.getCurrentGridState();
    // console.log('grid State', gridState);
    this.angularGrid.exportService.exportToFile({
      delimiter: DelimiterType.comma,
      filename: 'Customer',
      format: FileType.csv
    });
  }
  closeHistory() {
    this.angularGrid.dataView.refresh();
    this.showHistory = !this.showHistory;
  }

  onDedupRuleSubmit(event) {
    console.log('dedup Rules', event);

    const matchString =
      event.MatchType == MatchType.Similarity ? ' with precision ' : '';
    const rule = {
      type: RuleType.deduplicateExact,
      columns: event.Columns,
      // detail: 'Deduplicate ' + event.MatchType + ' rule based on columns ' + columns + matchString
      detail: 'Deduplicate ' + event.MatchType + ' rule',
      status: RuleStatus.Pending,
      isSelected: true,
      sortColumn: event.sortColumn
    };

    this.rules.push(rule);
    // this.storeService.setCustomerRules(this.rules);
    this.showHistory = true;
  }

  onManualCustSelectField(event) {
    console.log('golden rule', event);
    this.storeService.setManualCustomerField(event.Column);
    this.router.navigate(['/customer/goldenCust']);
  }
  onGoldenCustSelectField(event) {
    console.log('golden new rule', event);
    this.storeService.setCustomerGoldenRecordData(event.Column);
    this.router.navigate(['/customer/data']);
  }
  onRuleSelect(rule, isSelected) {
    rule.isSelected = isSelected;
    rule.status = isSelected ? RuleStatus.Pending : rule.status;
    console.log('rules', this.rules);
  }
  onRemoveRule(rule) {
    const index = this.rules.indexOf(rule);
    if (index >= 0) {
      this.rules.splice(index, 1);
      // this.storeService.setCustomerRules(this.rules);
    }
    console.log('on remove rule', rule);
  }
  processRules() {
    const selectedRules = this.rules.filter(
      r => r.isSelected === true && r.status !== RuleStatus.Applied
    );
    this.storeService.setCustomerRules(this.rules);
    this.customerService.processRules(selectedRules);
  }
  onDedupeClick() {
    console.log('on dedupe click');
    if (this.isDedupRuleAdded()) {
      toastr.info(
        'Dedupe rule is already added. To change the rule, remove already added rule.'
      );
      return false;
    }
  }
  onGoldenRecordClick() {
    console.log('on golden click');
    if (this.isGoldenRuleAdded()) {
      toastr.info(
        'Golden Customer rule is already added. To change the rule, remove already added rule.'
      );
      return false;
    }
  }
  manualReviewClick() {
    this.router.navigate(['/customer/manual']);
  }
  resetFilter() {
    this.filterData = JSON.parse(JSON.stringify(this.rulesData));
    console.log('this.filterData', this.filterData);
    this.isFilterSet = false;
    this.refreshGrid(this.rulesData);
  }
  ResetRules() {
    this.angularGrid.filterService.clearFilters();
    this.resetFilter();
    this.angularGrid.sortService.clearSorting();
    this.storeService.setCustomerRules([]);
    this.filterData = JSON.parse(JSON.stringify(this.masterData));
    this.rulesData = JSON.parse(JSON.stringify(this.masterData));
    this.refreshGrid(this.rulesData);
    // this.customerService
    //   .getCustomerData(this.defaultPageSize, this.currentPage)
    //   .subscribe(c => {
    //     this.storeService.setcustomerFinalData(c);
    //   });
  }
  // compareValues(key, order = 'asc') {
  //   return (a, b) => {
  //     if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
  //       // property doesn't exist on either object
  //       return 0;
  //     }

  //     const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
  //     const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

  //     let comparison = 0;
  //     if (varA > varB) {
  //       comparison = 1;
  //     } else if (varA < varB) {
  //       comparison = -1;
  //     }
  //     return order == 'desc' ? comparison * -1 : comparison;
  //   };
  // }
}
