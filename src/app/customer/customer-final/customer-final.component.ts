import { Component, OnInit } from '@angular/core';
import { StoreService } from '../services/store.service';
import { CustomerService } from '../services/customer.service';
import { Router } from '@angular/router';
import { CustomerFields } from '../models/customer';
import { HeaderService } from 'src/app/layout/services/header.service';
import { Rule, RuleType } from '../models/rule';
import { MatDialog } from '@angular/material/dialog';
import { WarningComponent } from '../warning/warning.component';
import { RuleService } from '../services/rule.service';
declare var toastr;
@Component({
  selector: 'app-customer-final',
  templateUrl: './customer-final.component.html',
  styleUrls: ['./customer-final.component.scss']
})
export class CustomerFinalComponent implements OnInit {
  // columnDefinitions: Column[] = [];
  // parentColumnDefinitions: Column[] = [];
  dataset: any[] = [];
  childrenRecords = [];
  masterData: any[] = [];
  targetFields: Array<any> = [];
  defaultPageSize = 20;
  currentPage = 1;
  gridObj;
  dataViewObj;
  updatedObject;
  // isConnected = false;
  status: string;
  sortColumn;
  goldenRecords: Array<any> = [];
  selectedObjects: Array<any> = [];
  rules: Array<Rule> = [];
  ruleCount: Array<any> = [];
  allCustomerFields = [];
  isAssignedCols = false;
  parentColumns;
  childColumns;
  unMergeCustomers = [];
  selectFiltersMain;
  childColumnId = 'childCount';
  selectedParent;
  totalCount = 0;

  constructor(
    public storeService: StoreService,
    public customerService: CustomerService,
    private router: Router,
    protected headerService: HeaderService,
    public dialog: MatDialog,
    public ruleService: RuleService
  ) { }

  ngOnInit(): void {
    this.storeService.getRuleChanged().subscribe(flag => {
      this.rules = JSON.parse(localStorage.getItem('rules'));
      this.ruleCount = JSON.parse(localStorage.getItem('rulesCount'));
      if (!this.ruleCount || this.ruleCount == null || this.ruleCount.length < 0) {
        this.ruleCount = [];
      }
    });
    this.headerService.setTitle('Consolidated Data');

    this.storeService.getUserSettings().subscribe(x => {
      if (x && x != null) {
        this.allCustomerFields = x;
        const userId = localStorage.getItem('userId');
        const assignedCols = x.filter(x => x.userEmailId ? x.userEmailId.toLowerCase : x.userEmailId == userId);
        this.isAssignedCols = (assignedCols && assignedCols.length > 0) ? true : false;
        this.targetFields = CustomerFields.getCustomerFields(this.allCustomerFields, false, false, true, this.isAssignedCols);
        this.targetFields.unshift({ id: this.childColumnId, name: 'Children' });
        this.targetFields.unshift({ id: 'select', name: '' });
        let index = this.targetFields.findIndex(x => x.id == 'id');
        if (index >= 0) {// remove id column if exists
          this.targetFields.splice(index, 1);
        }
        this.parentColumns = this.targetFields.map(column => column.id);

        this.childColumns = this.targetFields.map(column => column.id);
        index = this.childColumns.findIndex(x => x == this.childColumnId);
        if (index >= 0) {// remove id column if exists
          this.childColumns.splice(index, 1);
        }
        //  this.parentColumns.push('childrenCount');
        //  this.setColumns();
        // this.loadData();
      }
    });
  }

  loadData() {
    this.masterData = [];
    this.dataset = [];

    const modal = { 'filterDataRequest': this.selectFiltersMain, pageSize: this.defaultPageSize, pageNumber: this.currentPage };
    this.customerService.getMergedCustomers(modal).subscribe(d => {
      if (d && d != null) {
        this.masterData = JSON.parse(JSON.stringify(d.customerMerged));
        console.log('master Data', this.masterData);
        this.dataset = this.masterData; // .filter(x => x.parentId === -1);
        this.totalCount = d.totalCount;
      }
    });
  }
  onParentRowClick(customerNo) {
    this.selectedParent = customerNo;
    this.loadChildRecords(customerNo);
  }
  loadChildRecords(customerNo) {
    this.customerService.getCustomerChildren(customerNo).subscribe(x => {
      if (x.customer && x.customer != null) {
        this.childrenRecords = x.customer;
      } else {
        this.childrenRecords = [];
      }
    });
  }

  onUnMerge() {
    if (this.unMergeCustomers.length > 0 && this.unMergeCustomers !== undefined) {
      const rule = {
        ruleName: 'Manual UnMerge Rule',
        ruleTypeId: RuleType.unmerge,
        unMergeCustomers: this.unMergeCustomers
      };
      this.ruleService.saveNonRecurringRule(rule).subscribe(x => {
        toastr.info('Successfully marked for un-merge');
      });
      let index;
      this.unMergeCustomers.forEach(unMergeCustomer => {
        index = this.masterData.findIndex(x => x.customerNo == unMergeCustomer.customerNo);
        if (index >= 0) {
          this.masterData.splice(index, 1);
        }
      });
      this.unMergeCustomers = [];
      this.childrenRecords = [];
      this.loadData();
    } else {
      toastr.info('Please select customers to un-merge');
    }
  }

  onFilterChange(filter) {
    this.storeService.resetCustomerFinalData();
    this.masterData = [];
    this.dataset = [];
    this.selectFiltersMain = filter;
    if (this.selectFiltersMain) {
      this.loadData();
    }
  }
  isPrevDisabled() {
    if (this.currentPage <= 1 || this.dataset.length <= 0) {
      return true;
    }
    return false;
  }
  isNextDisabled() {
    if (((this.currentPage * this.defaultPageSize) >= this.totalCount) || this.dataset.length <= 0) {
      return true;
    }
    return false;
  }
  OnNextClick() {
    this.currentPage++;
    this.loadData();
  }
  OnPrevClick() {
    this.currentPage--;
    this.loadData();
  }

  onCheckBoxClick(event, row) {
    const index = this.unMergeCustomers.findIndex(x => x.customerNo == row.customerNo);
    if (!event.checked) {
      row.isSelected = false;
      if (index >= 0) { // if already exist then remove
        this.unMergeCustomers.splice(index, 1);
      }
    } else {
      row.isSelected = true;
      if (index < 0) { // if not already exists then push
        this.unMergeCustomers.push({ customerNo: row.customerNo });
      }
    }
  }
  isSelected(custNo) {
    const index = this.unMergeCustomers.findIndex(x => x.customerNo == custNo);
    // console.log('index', index);
    let isChecked = false;
    if (index >= 0) {
      isChecked = true;
    }
    return isChecked;
  }
}
