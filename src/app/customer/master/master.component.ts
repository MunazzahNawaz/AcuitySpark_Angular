import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
import { ElasticSearchService } from '../services/elastic-search.service';
import { Rule, MatchType, RuleType, RuleStatus } from '../models/rule';
import { Router } from '@angular/router';
import { CustomerService } from '../services/customer.service';
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

  constructor(
    public storeService: StoreService,
    public es: ElasticSearchService,
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
        hideForceFitButton: false,
        hideRefreshDatasetCommand: false,
        hideSyncResizeButton: true,
        hideToggleFilterCommand: false,
        hideTogglePreHeaderCommand: false,
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
        hideColumnHideCommand: false,
        hideClearFilterCommand: false,
        hideClearSortCommand: false,
        hideSortCommands: false
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
      // headerMenu: {
      //   onCommand: (e, args) => {
      //     alert('Command: ' + args.command);
      //   }
      // }
    };
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
    }
    // fill the template on async delay
    return new Promise(resolve => {
      resolve(this.masterData);
    });
  }

  setFilterRule(odataQuery) {
    const filterString = odataQuery.substring(odataQuery.indexOf('$filter='));
    if (filterString && filterString.length > 0) {
      console.log('filterString', filterString);
      const filterArray = filterString
        .replace('$filter=(', '')
        .split('substringof');

      console.log('filterArray', filterArray);
      filterArray.forEach(filter => {
        if (filter.length > 0) {
          const colName = filter
            .substring(filter.indexOf(',') + 1, filter.indexOf(')'))
            .trim();
          const colValue = filter
            .substring(filter.indexOf('(') + 1, filter.indexOf(','))
            .trim();
          this.removeRule(GridStateType.filter);
          if (this.rules.length <= 0) {
            this.showHistory = true;
          }
          this.rules.push({
            type: RuleType.filter,
            column: colName,
            value: colValue,
            detail: 'Filter ' + colName + ' on ' + colValue,
            status: RuleStatus.Pending,
            isSelected: true
          });
          this.storeService.setCustomerRules(this.rules);
        }
      });
      console.log('rules in ODATA', this.rules);
    }
  }
  isDedupRuleAdded() {
    const index = this.rules.findIndex(r => r.type == RuleType.deduplicate);
    if (index >= 0) {
      return true;
    }
    return false;
  }
  removeRule(ruleType) {
    const isexist = this.rules.filter(x => x.type == ruleType);
    console.log('isexist', isexist);
    if (isexist && isexist.length > 0) {
      const index = this.rules.findIndex(x => x.type == ruleType);
      this.rules.splice(index, 1);
    }
  }
  setColumns() {
    this.targetFields.forEach(t => {
      this.columnDefinitions.push({
        id: t,
        name: t,
        field: t,
        sortable: true,
        filterable: true,
        type: FieldType.string,
        editor: { model: Editors.text },
        minWidth: 150
      });
    });
    console.log('column definitions', this.columnDefinitions);
    this.columnDefinitions.forEach(columnDef => {
      columnDef.header = {
        menu: {
          items: [
            // add Custom Header Menu Item Commands at the bottom of the already existing internal custom items
            // you cannot override an internal command but you can hide them and create your own
            // also note that the internal custom commands are in the positionOrder range of 50-60,
            // if you want yours at the bottom then start with 61, below 50 will make your command(s) on top
            {
              iconCssClass: 'fa fa-question-circle',
              disabled: columnDef.id === 'effort-driven', // you can disable a command with certain logic
              titleKey: 'MY ITEM', // use "title" as plain string OR "titleKey" when using a translation key
              command: 'NEW',
              positionOrder: 61
            },
            // you can also add divider between commands (command is a required property but you can set it to empty string)
            {
              divider: true,
              command: '',
              positionOrder: 98
            }
          ]
        }
      };
    });
  }
  loadData() {
    this.masterData = [];
    // customerSource._source

    this.storeService.getcustomerFinalData().subscribe(d => {
      console.log('get data from service', d);
      if (d && d != null) {
        // this.masterData = JSON.parse(
        //   JSON.stringify(
        //     d.sort((a, b) =>
        //       a[AppConfig.defaultSortColumn] > b[AppConfig.defaultSortColumn]
        //         ? 1
        //         : -1
        //     )
        //   )
        // );
        this.masterData = d;
        if (this.masterData && this.masterData != null) {
          console.log('d.length', this.masterData.length);
          console.log('defaultPageSize', this.defaultPageSize);
          this.totalPages = Math.ceil(
            this.masterData.length / this.defaultPageSize
          );
          const tempdata = JSON.parse(JSON.stringify(this.masterData));
          this.dataset = tempdata.splice(
            (this.currentPage - 1) * this.defaultPageSize,
            this.currentPage * this.defaultPageSize
          );
        }
      }
    });

    // fill the dataset with your data
    // VERY IMPORTANT, Angular-Slickgrid uses Slickgrid DataView which REQUIRES a unique "id"
    // and it has to be lowercase "id" and be part of the dataset

    // // for demo purpose, let's mock a 1000 lines of data
    // for (let i = 0; i < 1000; i++) {
    //   const randomYear = 2000 + Math.floor(Math.random() * 10);
    //   const randomMonth = Math.floor(Math.random() * 11);
    //   const randomDay = Math.floor(Math.random() * 28);
    //   const randomPercent = Math.round(Math.random() * 100);

    //   this.dataset[i] = {
    //     id: i, // again VERY IMPORTANT to fill the "id" with unique values
    //     title: 'Task ' + i,
    //     duration: Math.round(Math.random() * 100) + '',
    //     percentComplete: randomPercent,
    //     start: `${randomMonth}/${randomDay}/${randomYear}`,
    //     finish: `${randomMonth}/${randomDay}/${randomYear}`,
    //     effortDriven: i % 5 === 0
    //   };
    // }
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
        if (this.rules && this.rules.length <= 0) {
          this.showHistory = true;
        }
        this.removeRule(GridStateType.sorter);
        this.rules.push({
          type: RuleType.sorter,
          column: e.gridState.sorters[0].columnId,
          value: e.gridState.sorters[0].direction,
          detail:
            'Sort ' +
            e.gridState.sorters[0].columnId +
            ' ' +
            e.gridState.sorters[0].direction,
          status: RuleStatus.Pending,
          isSelected: true
        });
        this.storeService.setCustomerRules(this.rules);
        break;

      case GridStateType.pagination:
        console.log('pagination change');
        break;

      case GridStateType.filter:
        console.log('filter change');
        // this.rules.push({
        //   type: GridStateType.sorter,
        //   detail:
        //     'Filter ' +
        //     e.gridState.sorters[0].columnId +
        //     e.gridState.sorters[0].direction
        // });
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

    const columns = event.Columns.map(x => {
      return x.ColumnName;
    });

    const precisions = event.Columns.map(x => {
      return x.Precision;
    });
    console.log('columns', columns);
    console.log('precisions', precisions);
    const matchString =
      event.MatchType == MatchType.Similarity
        ? ' with precision ' + precisions
        : '';

    const rule = {
      type: RuleType.deduplicate,
      column: columns,
      value: precisions,
      // detail: 'Deduplicate ' + event.MatchType + ' rule based on columns ' + columns + matchString
      detail: 'Deduplicate ' + event.MatchType + ' rule',
      status: RuleStatus.Pending,
      isSelected: true
    };

    this.rules.push(rule);
    this.storeService.setCustomerRules(this.rules);
    this.showHistory = true;
  }

  onGoldenCustSelectField(event) {
    console.log('golden rule', event);
    this.storeService.setGoldenCustomerField(event.Column);
    this.router.navigate(['/customer/goldenCust']);
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
      this.storeService.setCustomerRules(this.rules);
    }
    console.log('on remove rule', rule);
  }
  processRules() {
    const selectedRules = this.rules.filter(
      r => r.isSelected === true && r.status !== RuleStatus.Applied
    );
    this.customerService.processRules(selectedRules);
  }
  onDedupeClick() {
    console.log('on dedupe click');
    toastr.info('Dedupe rule is already added. To change the rule, remove already added rule.');
  }
  manualReviewClick() {
    this.router.navigate(['/customer/manual']);
  }
}
