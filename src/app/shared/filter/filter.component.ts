import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges, ViewChild } from '@angular/core';
import { CustomerFields, FieldDataTypes } from '../../customer/models/customer';
import { FilterOptions } from '../../customer/models/options';
import { Helper } from '../../customer/helper';
import { StoreService } from '../../customer/services/store.service';
import { FormControl } from '@angular/forms';
import { IKeys } from '../modals/countKeys';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AppConfigService } from 'src/app/app-config.service';
declare var toastr;

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})

export class FilterComponent implements OnInit, OnChanges {
  @Input() isExpandable: boolean;
  @Input() isExport: boolean;
  @Input() fileName: string;
  @Output() selectedFilter = new EventEmitter<any>();
  @Output() exportClick = new EventEmitter<any>();
  @Input() defaultFilters: any;
  @Input() isDate = true;
  @Input() totalGroups = [];
  searchInputControl = new FormControl();
  expanded = true;
  sourceFields: Array<string>;
  filterFields = [];
  filterText;
  icon;
  toDate;
  fromDate;
  stringOptions: Array<any>;
  numericOptions: Array<any>;
  dateOptions: Array<any>;
  allOpt: Array<any>;
  defaultText = 'default';
  selectedFieldName = this.defaultText;
  selectedGroupName = 'All';
  filterAction = this.defaultText;
  applied = false;
  dateOperationConst = 'dt';
  allCustomerFields = [];
  searchFieldsOptions: { [id: string]: IKeys; };
  searchOptions = [];
  filteredOptions: Observable<string[]>;
  ValidationMsgs: { [id: string]: { isError: boolean, error: string } } = {};

  constructor(private storeService: StoreService, private appConfig: AppConfigService) { }

  ngOnInit() {
    if (this.isExpandable == undefined) {
      this.isExpandable = true;
    }
    this.loadAllFields();
    this.storeService.getFieldCountKeys().subscribe(x => {
      this.searchFieldsOptions = x;
    });
    this.filteredOptions = this.searchInputControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    this.filteredOptions.subscribe(opt => console.log('filter options', opt));
    this.setErrorMsgs();
    this.stringOptions = FilterOptions.getStringOptions(false, true, false);
    this.numericOptions = FilterOptions.getNumericOptions(false, true, false);
    this.dateOptions = FilterOptions.getDateOptions(false, true, false);
    this.allOpt = FilterOptions.getAllOptions(false, false, true);
    this.filterAction = this.stringOptions[0];
    this.setDafaultFilter();
    this.apply();
  }
  loadAllFields() {
    this.storeService.getUserSettings().subscribe(x => {
      if (x && x != null) {
        this.allCustomerFields = x;
        this.sourceFields = CustomerFields.getFilterFields(this.allCustomerFields, false, false, true);
      }
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['defaultFilters']) {
      if (this.defaultFilters === null) {
        this.filterFields = [];
        this.toDate = '';
        this.fromDate = '';
      } else {
        if (!this.allCustomerFields || this.allCustomerFields.length <= 0) {
          this.loadAllFields();
        }
        this.setDafaultFilter();
      }
    }
  }
  public getSelectedFilters() {

    if (this.selectedFieldName != this.defaultText && this.selectedFieldName != '') {
      if (this.validate()) {
        this.addInFilter('', this.selectedFieldName, this.filterText, this.filterAction);
      }
    }
    const obj = {
      filters: this.filterFields,
      fromDate: this.fromDate,
      toDate: this.toDate
    };
    return obj;
  }
  setDafaultFilter() {
    if (this.defaultFilters && this.defaultFilters.filters !== undefined && this.defaultFilters.filters !== null) {
      this.filterFields = [];
      this.defaultFilters.filters.forEach(filter => {
        this.addInFilter(filter.fieldName, '', filter.fieldText, filter.operations);
      });
      this.toDate = this.defaultFilters.toDate;
      this.fromDate = this.defaultFilters.fromDate;
    } else {
      const defaultFilter = JSON.parse(localStorage.getItem('filterFields'));
      if (defaultFilter) {
        this.filterFields = defaultFilter.filters ? defaultFilter.filters : [];
        this.toDate = defaultFilter.toDate;
        this.fromDate = defaultFilter.fromDate;
      } else {
        this.setDefaultFilters();
      }
    }
  }

  setDefaultFilters() {
    const today = new Date();
    const frmDate = new Date();
    frmDate.setDate(today.getDate() - this.appConfig.getConfig('filterFromDateDays'));
    const defaultFilter = {
      toDate: today,
      fromDate: frmDate
    };
    this.toDate = defaultFilter.toDate;
    this.fromDate = defaultFilter.fromDate;
    localStorage.setItem('filterFields', JSON.stringify(defaultFilter));
  }

  setErrorMsgs() {
    this.ValidationMsgs['fieldName'] = { isError: false, error: 'Please select field to filter data' };
    this.ValidationMsgs['fieldText'] = { isError: false, error: 'Please enter text to filter data' };
    this.ValidationMsgs['operations'] = { isError: false, error: 'Please select operation to apply on selected Field' };
    this.ValidationMsgs['toDate'] = { isError: false, error: 'Please specify a valid end date' };
    this.ValidationMsgs['fromDate'] = { isError: false, error: 'Please select a valid start date' };
    this.ValidationMsgs['dateRange'] = { isError: false, error: 'Start date should be less than end date' };
  }
  private _filter(value: string): string[] {
    const filterValue = value ? value.toLowerCase() : '';
    if (this.searchOptions && this.searchOptions.length > 0) {
      return this.searchOptions.filter(option => option.toLowerCase().includes(filterValue));
    } else {
      return [];
    }

  }
  onSearchFieldChange() {
    console.log('in search Field Change');
    console.log('searchInput', this.searchInputControl);
    console.log('this.searchFieldsOptions', this.searchFieldsOptions);
    const fieldName = this.selectedFieldName.toLowerCase();
    if (this.searchFieldsOptions && this.searchFieldsOptions[fieldName] && this.searchFieldsOptions[fieldName] != null) {
      this.searchOptions = this.searchFieldsOptions[fieldName].keys;
    } else {
      this.searchOptions = [];
    }
    this.filterText = '';
    this.ValidationMsgs['fieldText'].isError = false;
    this.searchInputControl.setValue('');
    console.log('search options', this.searchOptions);
  }
  onGroupChange() {
    const groupName = this.selectedGroupName.toLowerCase();
    // if (this.searchFieldsOptions && this.searchFieldsOptions[fieldName] && this.searchFieldsOptions[fieldName] != null) {
    //   this.searchOptions = this.searchFieldsOptions[fieldName].keys;
    // } else {
    //   this.searchOptions = [];
    // }
    // this.filterText = '';
    // this.searchInputControl.setValue('');
    // console.log('search options', this.searchOptions);
  }
  isValid(key) {
    if (this.ValidationMsgs && this.ValidationMsgs[key] && this.ValidationMsgs[key].isError) {
      return false;
    }
    return true;
  }
  validateDateRange() {

    console.log('in validate date range');
    let isValid = true;
    this.ValidationMsgs['dateRange'].isError = false;
    this.ValidationMsgs['fromDate'].isError = false;
    this.ValidationMsgs['toDate'].isError = false;


    if (!this.fromDate || this.fromDate == '') {
      this.ValidationMsgs['fromDate'].isError = true;
      isValid = false;
    } else {
      this.ValidationMsgs['fromDate'].isError = false;
    }
    if (!this.toDate || this.toDate == '') {
      this.ValidationMsgs['toDate'].isError = true;
      isValid = false;
    } else {
      this.ValidationMsgs['toDate'].isError = false;
    }
    if (this.fromDate && this.toDate) {
      const fromDate = new Date(this.fromDate);
      const toDate = new Date(this.toDate);
      if (fromDate > toDate) {
        this.ValidationMsgs['dateRange'].isError = true;
        isValid = false;
      }
      console.log('fromDate', fromDate);
      console.log('toDate', toDate);
      console.log('fromDate > toDate', fromDate > toDate);
    }
    console.log('this.ValidationMsgs[dateRange].isError', this.ValidationMsgs['dateRange'].isError);
    console.log('this.ValidationMsgs[toDate].isError', this.ValidationMsgs['toDate'].isError);
    console.log('this.ValidationMsgs[fromDate].isError', this.ValidationMsgs['fromDate'].isError);
    return isValid;
  }
  validate() {
    let isValid = this.validateDateRange();
    if (this.selectedFieldName == this.defaultText || this.selectedFieldName == '') {
      this.ValidationMsgs['fieldName'].isError = true;
      isValid = false;
    } else {
      this.ValidationMsgs['fieldName'].isError = false;
    }
    if (!this.filterText || this.filterText == '' || this.filterText == null) {
      this.ValidationMsgs['fieldText'].isError = true;
      isValid = false;
    } else {
      this.ValidationMsgs['fieldText'].isError = false;
    }
    if (!this.filterAction || this.filterAction == this.defaultText) {
      this.ValidationMsgs['operations'].isError = true;
      isValid = false;
    } else {
      this.ValidationMsgs['operations'].isError = false;
    }
    return isValid;
  }
  add() {
    if (this.validate()) {
      this.addInFilter('', this.selectedFieldName, this.filterText, this.filterAction);
      this.filterText = '';
      //  this.filterAction = this.defaultText;
      this.selectedFieldName = this.defaultText;
    }

  }
  addInFilter(fieldDbName, fieldDisplayName, fieldText, action) {

    const fieldIcon = FilterOptions.getFieldIconByName(action);
    let operation = action;
    let fieldValue = fieldText;
    let dataType = FieldDataTypes.text;
    if (fieldDisplayName && fieldDisplayName != '') {
      dataType = CustomerFields.getFieldDataTypeByDisplayName(this.allCustomerFields, fieldDisplayName);
    }
    if (fieldDbName && fieldDbName != '') {
      dataType = CustomerFields.getFieldDataTypeByDbName(this.allCustomerFields, fieldDbName);
    }

    if (dataType == FieldDataTypes.Date) {
      operation = operation + '-' + this.dateOperationConst;
      fieldValue = Helper.formatDate_MDY(fieldText);
    }
    let currentField;
    if (fieldDisplayName && fieldDisplayName != '') {
      currentField = this.allCustomerFields.find(x => x.columnDisplayName == fieldDisplayName);
    }
    if (fieldDbName && fieldDbName != '') {
      currentField = this.allCustomerFields.find(x => x.columnDbName == fieldDbName);
    }
    const alreadyExistsIndex = this.filterFields.findIndex(x => x.fieldName == currentField.columnDbName);
    if (alreadyExistsIndex >= 0) {
      this.filterFields.splice(alreadyExistsIndex, 1);
    }
    this.filterFields.push(
      {
        fieldDisplayName: (currentField ? currentField.columnDisplayName : fieldDisplayName),
        fieldName: currentField.columnDbName,
        fieldText: fieldValue,
        operations: action,
        name: (currentField ? currentField.columnDisplayName : fieldDisplayName) + ': ' + fieldValue,
        icon: fieldIcon
      });
  }
  remove(item) {
    const index = this.filterFields.findIndex(x => x.fieldName == item.fieldName && x.operations == item.operations);
    if (index >= 0) {
      this.filterFields.splice(index, 1);
    }

  }
  isDateField() {
    return CustomerFields.isDateFieldByColName(this.allCustomerFields, this.selectedFieldName);
  }
  isNumericField() {
    return CustomerFields.isNumericFieldByColName(this.allCustomerFields, this.selectedFieldName);
  }
  apply() {
    let isValid = true;
    if (this.selectedFieldName != this.defaultText && this.selectedFieldName != '') {
      if (this.validate()) {
        this.addInFilter('', this.selectedFieldName, this.filterText, this.filterAction);
        this.expanded = !this.expanded;
      } else {
        isValid = false;
      }
    }
    if (this.isDate) {
      if (this.validateDateRange() && isValid) {
        const modal = {
          fromDate: this.fromDate,
          toDate: this.toDate,
          filters: [...this.filterFields]
        };
        this.selectedFilter.emit(modal);
        localStorage.setItem('filterFields', JSON.stringify(modal));
        this.applied = true;
      }
    } else { // non date filters
      const modal = {
        filterByGrp: this.selectedGroupName,
        filters: [...this.filterFields]
      };
      this.selectedFilter.emit(modal);
      this.applied = true;
    }
  }
  reset() {
    //  console.log('filterText', this.filterText);
    this.filterText = '';
    this.filterFields = [];
    this.selectedFieldName = this.defaultText;
    this.ValidationMsgs['fieldText'].isError = false;
    let modal;
    if (this.isDate) {
      this.setDefaultFilters();
      modal = {
        fromDate: this.fromDate,
        toDate: this.toDate,
        filters: [...this.filterFields]
      };
      localStorage.setItem('filterFields', JSON.stringify(modal));
      this.validateDateRange();
    } else {
      this.selectedGroupName = 'All';
      modal = {
        filters: [...this.filterFields],
        filterByGrp: 'All'
      };
    }
    this.applied = false;
    //  this.validate();
    this.selectedFilter.emit(modal);
  }
  onExportClick() {
    this.exportClick.emit();
  }

  toggle() {
    if (!this.isExpandable) {
      this.expanded = !this.expanded;
    }
  }
}
