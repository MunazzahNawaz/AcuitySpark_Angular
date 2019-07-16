import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener
} from '@angular/core';
import {
  Column,
  GridOption,
  AngularGridInstance,
  DelimiterType,
  FileType,
  GridStateType,
  GridStateChange
} from 'angular-slickgrid';
import { Customer } from '../models/customer';
import { StoreService } from '../services/store.service';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
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
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
declare var toastr;

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit, AfterViewInit {
  @ViewChild('headerMenu') headerMenu: ElementRef;
  @ViewChild('replaceModalBtn') openReplaceModal;
  @ViewChild('closeReplaceModal') closeReplaceModal;
  @ViewChild('filterInput') filterInput: ElementRef;
  public config: PerfectScrollbarConfigInterface = {};
  ruleStatus = RuleStatus;
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  masterData: any[] = [];
  filterData: any[] = [];
  rulesData: any[] = [];
  filterColumns: Array<any> = [];
  targetFields: Array<string> = [];
  defaultPageSize = 25;
  angularGrid: AngularGridInstance;
  gridObj;
  dataViewObj;
  updatedObject;
  pageSizes = [10, 25, 50, 100];
  currentPage = 1;
  totalRecords = '100,000';
  totalPages;
  isConnected = false;
  status: string;
  rules: Array<Rule> = [];
  archivedRules: Array<any> = [];
  showHistory = false;
  customerSources: Array<any> = [];
  isFilterSet = false;
  replaceColumn;
  replaceError = '';
  replaceWithError = '';
  showMenuForColumn;
  topHeaderMenu = 93;
  leftHeaderMenu = 8;
  // headerMenuColumn;
  menuStyle = {};
  phoneformatEnum = PhoneFormat;
  PhoneColumnId = 'Phone';
  filterText;
  matchExact = true;
  public scrollbarOptions = { axis: 'yx', theme: 'minimal-dark' };

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
    this.storeService.getCustomerArchivedRules().subscribe(rules => {
      this.archivedRules = rules;
    });
  }
  ngAfterViewInit(): void {
    const source = fromEvent(this.filterInput.nativeElement, 'keyup');
    source.pipe(debounceTime(600)).subscribe(c => {
      this.addFilterColumn();
      this.setFilterRule();
    });
  }
  // @HostListener('click', ['$event.target'])
  @HostListener('document:click', ['$event'])
  onClick(e) {
    if (!this.headerMenu.nativeElement.contains(event.target)) {
      $('.slick-header-menu').addClass('hide');
      $('.slick-header-menu').removeClass('show');
      this.showMenuForColumn = '';
      console.log('in grid click');
    }
  }
  loadGrid() {
    this.setColumns();

    this.gridOptions = {
      editable: true,
      enableCellNavigation: true,
      autoEdit: false,
      enableAutoResize: true, // true by default
      // alwaysShowVerticalScroll: false,
      // alwaysAllowHorizontalScroll: false,
      autoHeight: false,
      enableFiltering: false,
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
        hideClearAllFiltersCommand: true,
        hideClearAllSortingCommand: false,
        hideExportCsvCommand: false,
        hideExportTextDelimitedCommand: true,
        hideForceFitButton: true,
        hideRefreshDatasetCommand: true,
        hideSyncResizeButton: true,
        hideToggleFilterCommand: true,
        hideTogglePreHeaderCommand: true,
        iconCssClass: 'fa fa-bars',
        //  iconClearAllFiltersCommand: 'fa fa-filter text-danger',
        iconClearAllSortingCommand: 'fa fa-unsorted text-danger',
        iconExportCsvCommand: 'fa fa-download',
        iconExportTextDelimitedCommand: 'fa fa-download',
        iconRefreshDatasetCommand: 'fa fa-refresh',
        //   iconToggleFilterCommand: 'fa fa-random',
        iconTogglePreHeaderCommand: 'fa fa-random',
        menuWidth: 16,
        resizeOnShowHeaderRow: true
      },
      enableHeaderButton: true,
      enableHeaderMenu: false,
      headerButton: {
        onCommand: (e, args) => {
          console.log('e', e);
          // this.topHeaderMenu = e.offsetX + 10; // + 146;
          // this.leftHeaderMenu = e.offsetY;

          const column = args.column;
          const button = args.button;
          const command = args.command;
          this.showMenuForColumn = column.id;
        }
      },
      headerMenu: {
        autoAlign: true,
        autoAlignOffset: 12,
        minWidth: 150,
        //   iconClearFilterCommand: 'fa fa-filter text-danger',
        iconClearSortCommand: 'fa fa-unsorted',
        iconSortAscCommand: 'fa fa-sort-amount-asc',
        iconSortDescCommand: 'fa fa-sort-amount-desc',
        iconColumnHideCommand: 'fa fa-times',
        hideColumnHideCommand: true,
        hideClearFilterCommand: true,
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
      enablePagination: false
    };
  }
  onReplaceClick(colName) {
    this.replaceColumn = colName;
    this.openReplaceModal.nativeElement.click();
  }
  addReplaceRule(replace, replaceWith) {
    if (replace && replaceWith) {
      const isExistIndex = this.checkRuleExistByType_Col(this.replaceColumn, RuleType.replace);
      if (isExistIndex >= 0) {
        this.rules.splice(isExistIndex, 1);
      }
      console.log('showMenuForColumn', this.replaceColumn);
      console.log('replace', replace);
      console.log('replaceWith', replaceWith);
      this.rules.push({
        Type: RuleType.replace,
        Columns: [{ ColumnName: this.replaceColumn, ColumnValue: replace }],
        Detail:
          'Replace ' +
          replace +
          ' with ' +
          replaceWith +
          ' in ' +
          this.replaceColumn,
        Status: RuleStatus.Pending,
        IsSelected: true,
        SortColumn: replaceWith
      });
      let replaceStr = replace;
      if (this.matchExact) {
        replaceStr = new RegExp('\\b(?:' + replace + ')\\b', 'ig');
      }
      this.dataset.map(
        d =>
          (d[this.replaceColumn] = d[this.replaceColumn].replace(
            replaceStr,
            replaceWith
          ))
      );
      this.gridObj.invalidate();
      this.gridObj.render();
      this.closeReplaceModal.nativeElement.click();
    } else {
      if (replace == '') {
        this.replaceError = 'Provide the word to be replaced';
      }
      if (replaceWith == '') {
        this.replaceWithError = 'Provide the word to be replaced with';
      }
    }
  }
  clearReplace() {
    this.replaceError = '';
    this.replaceWithError = '';
    this.matchExact = true;
    this.closeReplaceModal.nativeElement.click();
  }
  addRemoveSpecialCharRule(colName) {
    const isExistIndex = this.checkRuleExistByType_Col(colName, RuleType.removeSpecialCharacters);
    if (isExistIndex >= 0) {
      this.rules.splice(isExistIndex, 1);
    }
    this.rules.push({
      Type: RuleType.removeSpecialCharacters,
      Columns: [{ ColumnName: colName, ColumnValue: '' }],
      Detail:
        'Remove special characters (' +
        this.appConfig.getConfig('specialCharacters') +
        ') from ' +
        colName,
      Status: RuleStatus.Pending,
      IsSelected: true,
      SortColumn: ''
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
    const isExistIndex = this.checkRuleExistByType_Col(colName, RuleType.trim);
    if (isExistIndex >= 0) {
      this.rules.splice(isExistIndex, 1);
    }
    this.rules.push({
      Type: RuleType.trim,
      Columns: [{ ColumnName: colName, ColumnValue: '' }],
      Detail: 'Trim ' + colName,
      Status: RuleStatus.Pending,
      IsSelected: true,
      SortColumn: ''
    });
    this.filterData.map(d => (d[colName] = d[colName].trim()));
    this.rulesData.map(d => (d[colName] = d[colName].trim()));
    this.refreshGrid(this.isFilterSet ? this.filterData : this.rulesData);
  }
  addToLowerRule(colName) {
    this.checkRuleExistC(colName);
    this.rules.push({
      Type: RuleType.toLower,
      Columns: [{ ColumnName: colName, ColumnValue: '' }],
      Detail: 'Change ' + colName + ' to Lower case',
      Status: RuleStatus.Pending,
      IsSelected: true,
      SortColumn: ''
    });
    this.filterData.map(d => (d[colName] = d[colName].toLowerCase()));
    this.rulesData.map(d => (d[colName] = d[colName].toLowerCase()));
    this.refreshGrid(this.isFilterSet ? this.filterData : this.rulesData);
  }
  addToUpperRule(colName) {
    this.checkRuleExistC(colName);
    this.rules.push({
      Type: RuleType.toUpper,
      Columns: [{ ColumnName: colName, ColumnValue: '' }],
      Detail: 'Change ' + colName + ' to Upper case',
      Status: RuleStatus.Pending,
      IsSelected: true,
      SortColumn: ''
    });
    this.filterData.map(d => (d[colName] = d[colName].toUpperCase()));
    this.rulesData.map(d => (d[colName] = d[colName].toUpperCase()));
    console.log('this.isFilterSet', this.isFilterSet);
    this.refreshGrid(this.isFilterSet ? this.filterData : this.rulesData);
  }
  addToTitleCaseRule(colName) {
    this.checkRuleExistC(colName);
    this.rules.push({
      Type: RuleType.toTitleCase,
      Columns: [{ ColumnName: colName, ColumnValue: '' }],
      Detail: 'Change ' + colName + ' to Title case',
      Status: RuleStatus.Pending,
      IsSelected: true,
      SortColumn: ''
    });
    console.log(this.rules);
    this.filterData.map(d => (d[colName] = this.toTitleCase(d[colName])));
    this.rulesData.map(d => (d[colName] = this.toTitleCase(d[colName])));
    this.refreshGrid(this.isFilterSet ? this.filterData : this.rulesData);
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
      Type: RuleType.formatPhone,
      Columns: [{ ColumnName: colName, ColumnValue: format }],
      Detail: 'Format ' + colName,
      Status: RuleStatus.Pending,
      IsSelected: true,
      SortColumn: ''
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

  checkRuleExistByType_Col(colName, ruleType) {
    const index = this.rules.findIndex(x => x.Type == ruleType && x.Columns[0].ColumnName == colName);
    console.log(index);
    if (index >= 0) {
      // const isExistIndex = this.rules[index].Columns.findIndex(
      //   c => c.ColumnName == colName
      // );
      // if (isExistIndex >= 0) {
        return index;
     // }
    }
    return -1;
  }
  checkRuleExistC(colName) {
    let alreadyExist = false;
    let indexRem = 0;
    this.rules.forEach((r, indexR) => {
      if (
        r.Type === RuleType.toLower ||
        r.Type === RuleType.toUpper ||
        r.Type === RuleType.toTitleCase
      ) {
        const index = r.Columns.findIndex(c => c.ColumnName == colName);
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
      r => r.Type === RuleType.formatPhone
    );
    if (isExistIndex >= 0) {
      this.rules.splice(isExistIndex, 1);
    }
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

  addFilterColumn() {
    const val = this.filterText;
    let index = this.filterColumns.findIndex(
      x => x.ColumnName === this.showMenuForColumn
    );
    console.log('index', index);
    if (index >= 0) {
      this.filterColumns.splice(index, 1);
    }
    this.filterColumns.push({
      ColumnName: this.showMenuForColumn,
      ColumnValue: val
    });

    console.log('filter cols', this.filterColumns);
  }
  setFilterRule() {
    console.log('filterColumns', this.filterColumns);

    this.filterData = JSON.parse(JSON.stringify(this.rulesData));
    if (this.filterColumns && this.filterColumns.length > 0) {
      this.filterColumns.forEach(filter => {
        this.isFilterSet = true;
        this.filterData = this.filterData.filter(d => {
          let str = '' + d[filter.ColumnName];
          console.log('str', str);
          console.log('colValue', filter.ColumnValue);
          return str.toUpperCase().includes(filter.ColumnValue.toUpperCase());
        });
        this.refreshGrid(this.filterData);
      });
    } else {
      this.resetFilter();
    }
  }

  isDedupRuleAdded() {
    const index = this.rules.findIndex(
      r => r.Type == RuleType.deduplicateExact
    );
    const similarityIndex = this.rules.findIndex(
      r => r.Type == RuleType.deduplicateSimilarity
    );
    if (index >= 0 || similarityIndex >= 0) {
      return true;
    }
    return false;
  }
  isGoldenRuleAdded() {
    const index = this.rules.findIndex(r => r.Type == RuleType.goldenCustomer);
    if (index >= 0) {
      return true;
    }
    return false;
  }
  removeRuleByType(ruleType) {
    console.log('rules before splice', this.rules);
    const isexist = this.rules.filter(x => x.Type == ruleType);
    // console.log('remove rule',this.rules.filter(x => x.type == ruleNumber));
    console.log('isexist', isexist);
    const indexes = [];
    if (isexist && isexist.length > 0) {
      this.rules.forEach((rule, index, object) => {
        console.log('object before splice', object, index);
        if (rule.Type === ruleType) {
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
    // this.targetFields.forEach(col => {
    //   this.columnDefinitions.push({
    //     id: col,
    //     name: col,
    //     field: col,
    //     sortable: true,
    //     filterable: true,
    //     type: FieldType.string,
    //     editor: { model: Editors.text },
    //     minWidth: 150
    //   });
    // });
    this.columnDefinitions = Customer.getColumns();

    console.log('column definitions', this.columnDefinitions);
    this.columnDefinitions.forEach(col => {
      col.header = {
        buttons: [
          {
            cssClass: 'icon-filter-rules-icon',
            command: 'menu',
            tooltip: 'Header options'
          }
        ]
      };
    });
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
  onHeaderCellClick(e, args) {
    console.log('args on header cell click', args);
  }
  onGridClicked(e, args) {
    $('.slick-header-menu').addClass('hide');
    $('.slick-header-menu').removeClass('show');
    this.showMenuForColumn = '';
    console.log('in grid click', args);
  }
  onHeaderCellRendered(e, args) {
    console.log('e.offset', e.offset);
    console.log('args on header render', args);
    $('.slick-header-menu').addClass('hide');
    $('.slick-header-menu').removeClass('show');

    const elmName = '#' + args.node.id; // +'.slick-header-button.icon-filter-rules-icon';
    const elm = $(elmName);

    // const left = args.node.offsetLeft - 935;
    // const top = args.node.offsetHeight;

    this.topHeaderMenu = elm.offset().top + 45; // + 146;
    this.leftHeaderMenu = elm.offset().left>=1100? elm.offset().left-160:elm.offset().left;

    // this.menuStyle =
    //   '{min-width: 150px; top: ' + top + 'px; left: ' + left + 'px;}';

    if (args.column.id === this.showMenuForColumn) {
      console.log('in common');
      console.log('args.column.Id', args.column.id);
      console.log('this.showMenuForColumn', this.showMenuForColumn);
      console.log('this.PhoneColumnId', this.PhoneColumnId);
      $('.slick-header-menu').addClass('show');
      const index = this.filterColumns.findIndex(
        x => x.ColumnName == this.showMenuForColumn
      );
      console.log('this.showMenuForColumn', this.showMenuForColumn);
      console.log('filter cols', this.filterColumns);
      console.log('filter index', index);
      if (index >= 0) {
        console.log(
          'filter index value',
          this.filterColumns[index].ColumnValue
        );
        this.filterText = this.filterColumns[index].ColumnValue;
      } else {
        this.filterText = '';
      }
    }
    // $(this.headerMenu.nativeElement.innerHTML)
    //   .data('columnId', args.column.id)
    //   .val('')
    //   .appendTo(
    //     args.node.offsetParent.offsetParent.offsetParent.offsetParent
    //   );
  }
  onCellChanged(e, args) {
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
      Type: RuleType.deduplicateExact,
      Columns: event.Columns,
      // detail: 'Deduplicate ' + event.MatchType + ' rule based on columns ' + columns + matchString
      Detail: 'Deduplicate ' + event.MatchType + ' rule',
      Status: RuleStatus.Pending,
      IsSelected: true,
      SortColumn: event.sortColumn
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
    this.rules.push({
      Type: RuleType.goldenCustomer,
      Columns: event.cols,
      Detail: 'Golden Customer rule',
      Status: RuleStatus.Pending,
      IsSelected: true,
      SortColumn: event.groupByCols
    });
    // this.storeService.setCustomerGoldenRecordData(event.Column);
    // this.router.navigate(['/customer/data']);
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
      r => r.IsSelected === true && r.Status !== RuleStatus.Applied
    );
    this.storeService.setCustomerRules(this.rules);
    this.customerService.processRules(selectedRules);

    const index = this.rules.findIndex(x =>
      x.Type === RuleType.deduplicateExact ||
      x.Type === RuleType.deduplicateSimilarity ||
      x.Type === RuleType.goldenCustomer ||
      x.Type === RuleType.manualReview);
    console.log(index);
    if (index >= 0) {
      this.totalRecords = '50,512';
      this.router.navigate(['/customer/final']);
    }
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
    this.filterColumns = [];
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
  saveRule(ruleName) {
    this.archivedRules.push({ Name: ruleName, Rules: this.rules });
    this.storeService.setCustomerArchivedRules(this.archivedRules);
  }
  getRandom() {
    alert(Helper.getRandomNumber(100, 1000));
  }
  showGolden() {
    this.router.navigate(['/customer/goldenFull']);
  }
}
