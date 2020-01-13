import { Component, OnInit } from '@angular/core';
import { CustomerFields } from '../models/customer';
import { SelectionModel } from '@angular/cdk/collections';
import { CustomerService } from '../services/customer.service';
import { StoreService } from '../services/store.service';
import { RuleType, RuleStatus } from '../models/rule';
import { RuleService } from '../services/rule.service';
import { HeaderService } from '../../layout/services/header.service';
import { RowCountService } from 'src/app/shared/services/row-count.service';
declare var toastr;

@Component({
  selector: 'app-manual-merge',
  templateUrl: './manual-merge.component.html',
  styleUrls: ['./manual-merge.component.scss']
})
export class ManualMergeComponent implements OnInit {
  columns = [];
  grpTableColumns: string[] = ['groupField'];
  manualMergeGrpsDS = [];
  manualMergeChildDS;
  childRecords;
  // selection = new SelectionModel<any>(true, []);
  displayColumns;
  applied;
  candiateMergeRecords: Array<any> = [];
  allCustomerFields = [];
  isAssignedCols = true;
  selectedMaster;
  mergedGrps = [];
  defaultPageSize = 25;
  pageNo = 1;
  totalRecords = 0;
  selectedCustomer;
  totalGroups = [];
  selectedFilters: {};
  // active = false;
  isProcessing = false;

  constructor(
    public storeService: StoreService,
    public rowCountService: RowCountService,
    private customerServcie: CustomerService,
    private ruleService: RuleService, public headerService: HeaderService) { }

  ngOnInit() {
    this.headerService.setTitle('Manual Merge');
    // this.rowCountService.getCandidateMergeRecordsCount().subscribe(resp => {
    //   this.totalRecords = resp.count;
    // })

    this.storeService.getUserSettings().subscribe(x => {
      if (x && x != null) {
        const userId = localStorage.getItem('userId');
        const assignedCols = x.filter(x => x.userEmailId ? x.userEmailId.toLowerCase : x.userEmailId == userId.toLowerCase);
        this.isAssignedCols = (assignedCols && assignedCols.length > 0) ? true : false;

        this.allCustomerFields = x;
        this.columns = CustomerFields.getCustomerFields(this.allCustomerFields, false, false, true, this.isAssignedCols);
        let index = this.columns.findIndex(x => x.id == 'id');
        if (index >= 0) {// remove id column if exists
          this.columns.splice(index, 1);
        }
        this.columns.unshift({ id: 'select', name: 'Select' });
        this.displayColumns = this.columns.map(column => column.id);
      }
    });
    this.loadManualMergeData();
  }
  loadManualMergeData() {
    this.customerServcie.getCandidateMerge(this.selectedFilters, this.defaultPageSize, this.pageNo).subscribe(x => {
      this.totalRecords = x.masterIdTotalCount;
      this.manualMergeChildDS = x.candidateMerge;
      this.totalGroups = x.candidateMergeGroups;
      this.groupRecords();
    });
  }
  groupRecords() {
    let oldMasterId = 0;
    let count = 0;
    let manualGrpCustomerIndex = -1;
    this.manualMergeGrpsDS = [];
    this.childRecords = [];
    this.mergedGrps = [];
    this.manualMergeChildDS.forEach(element => {
      count++;
      element.isSelected = false;
      if (element.masterID != oldMasterId) {
        count = 1;
        element.isMaster = 'Y';
        element.isSelected = true;
        this.manualMergeGrpsDS.push(element);
        manualGrpCustomerIndex++;
      } else {
        this.manualMergeGrpsDS[manualGrpCustomerIndex].count = count;
      }
      oldMasterId = element.masterID;

    });
  }
  isPrevDisabled() {
    if (this.pageNo <= 1) {
      return true;
    }
    return false;
  }
  isNextDisabled() {
    let disabled = false;
    if ((this.pageNo * this.defaultPageSize) >= this.totalRecords) {
      disabled = true;
    }
    return disabled;
  }
  OnNextClick() {
    if ((this.pageNo * this.defaultPageSize) < this.totalRecords) {
      ++this.pageNo;
      this.loadManualMergeData();
    }
  }
  OnPrevClick() {
    if (this.pageNo > 1) {
      --this.pageNo;
      this.loadManualMergeData();
    }
  }
  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.manualMergeGrpsDS.length;
  //   return numSelected === numRows;
  //   //return false;
  // }
  onParentChange(row) {
    this.manualMergeChildDS.forEach(x => {
      if (x.masterID == this.selectedMaster) {
        if (x.customerNo == row.customerNo) {
          x.isMaster = 'Y';
          x.isSelected = true;
          row.isSelected = true;
        } else {
          x.isMaster = 'N';
        }
      }
    });
  }
  onChangeManualMerge(event, customerNo) {
    let currentCustomer = this.manualMergeChildDS.filter(x => x.customerNo == customerNo);
    if (currentCustomer && currentCustomer.length > 0) {
      if (event.checked) {
        currentCustomer[0].isSelected = true;
      } else {
        currentCustomer[0].isSelected = false;
        currentCustomer[0].isMaster = 'N';
      }
    }
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggle() {
  //   this.isAllSelected() ?
  //     this.selection.clear() :
  //     this.manualMergeGrpsDS.forEach(row => this.selection.select(row));
  // }

  /** The label for the checkbox on the passed row */
  // checkboxLabel(row?: any): string {
  //   if (!row) {
  //     return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  //   }
  //   return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.groupField + 1}`;
  // }
  // addMassMergeRule() {
  //   this.selection.selected.forEach(sel => {
  //     let parent = this.manualMergeGrpsDS.filter(x => x.masterID == sel.masterID && x.isMaster == 'Y');
  //     let alreadyExistsIndex = this.mergedGrps.findIndex(x => x.groupId == sel.masterID);
  //     if (parent && parent.length > 0 && alreadyExistsIndex < 0) { // this grp not already added then add in final list
  //       this.mergedGrps.push({ groupId: parent[0].masterID, customerNo: parent[0].customerNo });
  //     }

  //   });
  // }
  isAlreadyMerged(masterId) {
    const alreadyExists = this.mergedGrps.findIndex(x => x.groupId == masterId);
    if (alreadyExists >= 0) {
      return true;
    }
    return false;
  }

  addMergeRule() {
    if (this.selectedMaster !== undefined) {
      const selectedRecords = this.manualMergeChildDS.filter(x => x.masterID == this.selectedMaster && x.isSelected == true);
      const parentRecords = this.manualMergeChildDS.filter(x => x.masterID == this.selectedMaster && x.isMaster == 'Y');
      if (selectedRecords.length <= 1) {
        toastr.info('select 2 or more records to merge');
        return;
      }
      if (parentRecords.length <= 0) {
        toastr.info('select master record for this group');
        return;
      }
      const currentDate = new Date();
      selectedRecords.forEach(rec => {
        this.mergedGrps.push({ loadDate: currentDate, groupId: this.selectedMaster, customerNo: rec.customerNo, isMaster: rec.isMaster == 'Y' ? 'YES' : 'NO' });
      });
      this.SaveRule();
    } else {
      toastr.info('Please select rule to merge');
    }

  }
  showChildRecords(event, masterId) {
    // this.active = true;
    this.selectedMaster = masterId;
    this.childRecords = this.manualMergeChildDS.filter(x => x.masterID == this.selectedMaster);

    event.stopPropagation();
  }
  SaveRule() {
    this.isProcessing = true;
    const rule = {
      ruleName: 'Manual Merge Rule',
      ruleTypeId: RuleType.manualMerge,
      manualMergeCustomers: this.mergedGrps
    };
    this.ruleService.saveNonRecurringRule(rule).subscribe(x => {
      this.loadManualMergeData();
      toastr.success('Successfully scheduled for merge');
      this.isProcessing = false;
    });
  }

  onFilterChange(filter) {
    this.selectedFilters = filter;
    this.loadManualMergeData();
  }

}
