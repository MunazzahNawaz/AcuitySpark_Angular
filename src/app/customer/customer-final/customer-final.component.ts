import { Component, OnInit } from '@angular/core';
import { Column, GridOption, AngularGridInstance } from 'angular-slickgrid';
import { StoreService } from '../services/store.service';
import { CustomerService } from '../services/customer.service';
import { Router } from '@angular/router';
import { Customer } from '../models/customer';
declare var toastr;

@Component({
  selector: 'app-customer-final',
  templateUrl: './customer-final.component.html',
  styleUrls: ['./customer-final.component.scss']
})
export class CustomerFinalComponent implements OnInit {
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
  selectedObjects;

  constructor(
    public storeService: StoreService,
    public customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.targetFields = Customer.getCustomerFields();
    this.loadGrid();
  }
  loadGrid() {
    this.setColumns();

    this.gridOptions = {
      // enableGrouping: true,
      // editable: true,
      enableCellNavigation: true,
      enableColumnReorder: false,
      autoEdit: false,
      enableAutoResize: true, // true by default,
      autoHeight: false,
      enableFiltering: false,
      enableRowSelection: true,
      enableCheckboxSelector: true,
      showHeaderRow: false,
      // forceFitColumns: false,
      // enablePagination: false,
      enableHeaderMenu: false,
      enableGridMenu: false,
      checkboxSelector: {
        // remove the unnecessary "Select All" checkbox in header when in single selection mode
        hideSelectAllCheckbox: true
      },
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: true
      }
    };
  }

  setColumns() {
    this.columnDefinitions = Customer.getColumns();
  }
  loadData() {
    this.masterData = [];
    this.storeService.getcustomerFinalData().subscribe(d => {
      console.log('customer final', d);
      if (d && d != null) {
        // const tempData = d.sort((a, b) =>
        //   a[this.sortColumn] > b[this.sortColumn] ? 1 : -1
        // );
        this.masterData = JSON.parse(JSON.stringify(d));
        //  if (this.masterData && this.masterData != null) {
        this.dataset = this.masterData; //.filter(x => x.parentId === -1);
        // }
      }
    });
  }
  onSelectedRowsChanged(e, args) {
    // if (Array.isArray(args.rows)) {
    //   this.selectedObjects = args.rows.map(idx => {
    //     const item = this.gridObj.getDataItem(idx);
    //     return item.title || '';
    //   });
    // }
    // console.log('event on row select args', args);
    this.dataset.map(d => (d.isgolden = false));
    this.selectedObjects = [];
    const selectedRow = this.dataViewObj.getItem(args.rows[0]);
    if (selectedRow) {
      selectedRow.isgolden = true;
      // // mark all other items in grp as not golden records
      // const grps = this.dataViewObj.get .getGroups();
      // grps.forEach(g => {
      //   if (g.groupingKey == selectedRow[this.sortColumn]) {
      //     g.rows.forEach(r => {
      //       if (r.id != selectedRow.id) {
      //         r.isgolden = false;
      //         this.dataViewObj.updateItem(r.id, r);
      //         r.parentId = selectedRow.id;
      //         this.goldenRecords.push(r);
      //       }
      //     });
      //   }
      // });
      this.dataViewObj.updateItem(selectedRow.id, selectedRow);
      this.selectedObjects.push(selectedRow);
      // update css
      this.angularGrid.dataView.refresh();
      this.dataViewObj.getItemMetadata = this.metadata(
        this.dataViewObj.getItemMetadata
      );
      this.gridObj.invalidate();
      this.gridObj.render();
    }

    console.log('this.selectedObjects', this.selectedObjects);
  }
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
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
      return meta;
    };
  }
}
