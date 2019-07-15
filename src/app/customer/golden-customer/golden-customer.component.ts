import { Component, OnInit } from '@angular/core';
import { Customer } from '../models/customer';
import {
  Column,
  GridOption,
  AngularGridInstance,
  Sorters,
  SortDirectionNumber
} from 'angular-slickgrid';
import { StoreService } from '../services/store.service';
import { Router } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { ConfirmDialogService } from 'src/app/confirm-dialog/confirm-dialog.service';
// import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
declare var toastr;

@Component({
  selector: 'app-golden-customer',
  templateUrl: './golden-customer.component.html',
  styleUrls: ['./golden-customer.component.scss']
})
export class GoldenCustomerComponent implements OnInit {
  // @ViewChild('confirm') confirm: ConfirmationDialogComponent;
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
  isConnected = false;
  status: string;
  sortColumn;
  goldenRecords: Array<any> = [];

  constructor(
    public storeService: StoreService,
    public customerService: CustomerService,
    private router: Router,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    // this.route.queryParams.subscribe(params => {
    //   this.sortColumn = params['SortColumn'] || '';
    //   this.loadData();
    // });
    this.storeService.getManualCustomerField().subscribe(c => {
      this.sortColumn = c;
      this.loadData();
    });

    this.targetFields = Customer.getCustomerFields();
    this.loadGrid();
  }
  loadGrid() {
    this.setColumns();

    this.gridOptions = {
      enableGrouping: true,
      editable: true,
      enableCellNavigation: true,
      enableColumnReorder: false,
      autoEdit: false,
      enableAutoResize: true, // true by default,
      autoHeight: false,
      enableFiltering: false,
      enableRowSelection: true,
      enableCheckboxSelector: true,
      showHeaderRow: false,
      forceFitColumns: false,
      enablePagination: false,
      enableHeaderMenu: false,
      enableGridMenu: false,
      checkboxSelector: {
        // remove the unnecessary "Select All" checkbox in header when in single selection mode
        hideSelectAllCheckbox: true
      }
    };
  }

  setColumns() {
    this.columnDefinitions = Customer.getColumns();
  }
  filterData(arr) {
    const duplicateIds = arr
      .map(e => e[this.sortColumn])
      .map((e, i, final) => final.indexOf(e) !== i && i)
      .filter(obj => arr[obj])
      .map(e => arr[e][this.sortColumn]);
    return arr.filter(obj => duplicateIds.includes(obj[this.sortColumn]));
  }

  loadData() {
    this.masterData = [];
    this.customerService
      .getCustomerGroupData(this.sortColumn)
      .subscribe(data => {
        console.log('in GOLDEN LOAD DATA', data);
        // TODO: Temporary code
        const dataSet = [];
        let id = 1;
        data.forEach(d => {
          d.id = id;
          id++;
          dataSet.push(d);
        });
        // end temporary code

        // let tempData = d.sort((a, b) =>
        //   a[this.sortColumn] > b[this.sortColumn] ? 1 : -1
        // );
        // console.log('sorted data', tempData);
        // tempData = this.filterData(tempData);
        this.masterData = JSON.parse(JSON.stringify(dataSet));
        console.log('temp data', this.masterData);
        if (
          this.masterData &&
          this.masterData != null &&
          this.masterData.length > 0
        ) {
          this.dataset = this.masterData;
        } else {
          toastr.info(
            'No duplicate records based on column: ' + this.sortColumn
          );
          this.router.navigate(['customer/data']);
        }
      });
  }
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.angularGrid.slickGrid.setSortColumn(this.sortColumn, true);
    // the Angular Grid Instance exposes both Slick Grid & DataView objects
    this.gridObj = angularGrid.slickGrid;
    // this.gridObj.onBeforeEditCell().subscribe((row, cell, item, column) => {
    //   if (row.isgolden) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // });
    this.dataViewObj = angularGrid.dataView;
    this.groupByField(this.dataViewObj);
    //  this.filterGrid();
    this.dataViewObj.setFilterArgs({
      grps: this.dataViewObj.getGroups
    });
    this.dataViewObj.getItemMetadata = this.metadata(
      this.dataViewObj.getItemMetadata
    );
    this.gridObj.invalidate();
    this.gridObj.render();
  }

  metadata(previousItemMetadata) {
    const newCssClass = 'goldenRecord';
    return (rowNumber: number) => {
      const item = this.dataViewObj.getItem(rowNumber);
      let meta = previousItemMetadata(rowNumber) || {};

      if (meta && item && item.isgolden) {
        if (!meta.cssClasses || meta.cssClasses.indexOf(newCssClass) < 0) {
          meta.cssClasses = (meta.cssClasses || '') + ' ' + newCssClass;
        }
      }
      if (item.__group) {
        // adding a class
        meta.cssClasses +=
          ' ' + (item.collapsed === 1 ? 'collapsed' : 'expanded');
        // or trigger a custom event....
      }
      return meta;
    };
  }
  groupByField(dataview) {
    dataview.setGrouping({
      getter: this.sortColumn, // the column `field` to group by
      formatter: g => {
        return (
          `<span class="count">${g.count}</span>` +
          this.sortColumn +
          `:  ${g.value} <span style="color:green"></span>`
        );
      },
      comparer: (a, b) => {
        return Sorters.numeric(a.value, b.value, SortDirectionNumber.asc);
      },
      // aggregators: [
      //   // (required), what aggregators (accumulator) to use and on which field to do so
      //   new Aggregators.Min('percentComplete')
      // ],
      displayTotalsRow: false,
      aggregateCollapsed: true, // (optional), do we want our aggregator to be collapsed?
      lazyTotalsCalculation: true // (optional), do we want to lazily calculate the totals? True is commonly used
    });
  }
  onBeforeEditCell(e, args) {
    console.log('onBeforeEditCell', args);
    if (args.item.isgolden) {
      return true;
    }
    return false;
  }
  onCellChanged(e, args) {
    console.log('onCellChanged', args);
  }

  onCellClicked(e, args) {
    console.log('onCellClicked', args);
  }
  onRowSelectionChange(event, args) {
    console.log('event on row select args', args);
    const selectedRow = this.dataViewObj.getItem(args.rows[0]);
    if (selectedRow) {
      selectedRow.isgolden = true;

      // push records in goldenrecords array
      // remove if already exists
      const isExistIndex = this.goldenRecords.findIndex(
        x => x[this.sortColumn] == selectedRow[this.sortColumn]
      );
      if (isExistIndex >= 0) {
        console.log('isexistindex', isExistIndex);
        this.goldenRecords = this.goldenRecords.filter(
          x => x[this.sortColumn] != selectedRow[this.sortColumn]
        );
      }
      // mark all other items in grp as not golden records
      const grps = this.dataViewObj.getGroups();
      grps.forEach(g => {
        if (g.groupingKey == selectedRow[this.sortColumn]) {
          g.rows.forEach(r => {
            if (r.id != selectedRow.id) {
              r.isgolden = false;
              this.dataViewObj.updateItem(r.id, r);
              r.parentId = selectedRow.id;
              this.goldenRecords.push(r);
            }
          });
        }
      });
      selectedRow.isgolden = true;
      selectedRow.parentId = -1;
      this.dataViewObj.updateItem(selectedRow.id, selectedRow);
      this.goldenRecords.push(selectedRow);
      // update css
      console.log('grps', grps);
      this.angularGrid.dataView.refresh();
      this.dataViewObj.getItemMetadata = this.metadata(
        this.dataViewObj.getItemMetadata
      );
      this.gridObj.invalidate();
      this.gridObj.render();

      console.log('golden records', this.goldenRecords);
    }
  }
  get parentCount() {
    const goldenRecords = this.goldenRecords.filter(x => x.parentId == -1);
    return goldenRecords.length;
  }
  onSubmit() {
    const totalgrps = this.dataViewObj.getGroups().length;
    const goldenRecords = this.goldenRecords.filter(x => x.parentId == -1);

    // if (!goldenRecords || goldenRecords.length <= 0) {
    //   toastr.info(
    //     'you have not selected any record. Please select record to move next.'
    //   );
    //   return;
    // } else if (goldenRecords && goldenRecords.length < totalgrps) {
    //   const msg =
    //     'you have selected ' +
    //     goldenRecords.length +
    //     ' Golden records out of ' +
    //     totalgrps +
    //     ' groups, Do you wish to proceed with your selection?';
    //   let that = this;
    //   this.confirmDialogService.confirmThis(
    //     msg,
    //     function() {
    //       that.storeService.setCustomerGoldenRecordData(that.goldenRecords);
    //       console.log('submit', that.goldenRecords);
    //       that.router.navigateByUrl('/customer/goldenfinal');
    //     },
    //     function() {
    //       return;
    //     }
    //   );
    // } else {
    this.storeService.setCustomerGoldenRecordData(this.goldenRecords);
    console.log('submit', this.goldenRecords);
    this.router.navigateByUrl('/customer/goldenfinal');
    // }
  }
  onCancel() {
    console.log('submit', this.goldenRecords);
    this.storeService.setCustomerGoldenRecordData([]);
    this.router.navigateByUrl('/customer/data');
  }
}
