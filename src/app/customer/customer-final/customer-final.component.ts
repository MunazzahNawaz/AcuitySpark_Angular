import { Component, OnInit } from '@angular/core';
import { Column, GridOption, AngularGridInstance, FieldType, Editors } from 'angular-slickgrid';
import { StoreService } from '../services/store.service';
import { CustomerService } from '../services/customer.service';
import { Router } from '@angular/router';
import { Customer } from '../models/customer';
import { HeaderService } from 'src/app/layout/services/header.service';
declare var toastr;

@Component({
  selector: 'app-customer-final',
  templateUrl: './customer-final.component.html',
  styleUrls: ['./customer-final.component.scss']
})
export class CustomerFinalComponent implements OnInit {
  columnDefinitions: Column[] = [];
  parentColumnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  childGridOptions: GridOption = {};
  dataset: any[] = [];
  childrenRecords = [];
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
    private router: Router,
    protected headerService: HeaderService
  ) {}

  ngOnInit(): void {
    this.headerService.setTitle('Customer Merged Records');
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
    this.childGridOptions = {
     // enableCellNavigation: true,
      enableColumnReorder: false,
      autoEdit: false,
      enableAutoResize: true, // true by default,
      autoHeight: false,
      enableFiltering: false,
     // enableRowSelection: true,
     // enableCheckboxSelector: true,
      showHeaderRow: false,
      // forceFitColumns: false,
      // enablePagination: false,
      enableHeaderMenu: false,
      enableGridMenu: false,
      // checkboxSelector: {
      //   // remove the unnecessary "Select All" checkbox in header when in single selection mode
      //   hideSelectAllCheckbox: true
      // },
      // rowSelectionOptions: {
      //   // True (Single Selection), False (Multiple Selections)
      //   selectActiveRow: true
      // }
    };
  }

  setColumns() {
    this.columnDefinitions = Customer.getColumns();
   // this.parentColumnDefinitions = Customer.getColumns();

    this.parentColumnDefinitions.push({
      id: 'MergeId',
      name: 'Merge Id',
      field: 'MergeId',
      sortable: true,
      filterable: true,
      type: FieldType.string,
      editor: { model: Editors.text },
      minWidth: 100
    });

    Customer.getColumns().forEach(col => {
      this.parentColumnDefinitions.push(col);
    });

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
        this.dataset = this.masterData; // .filter(x => x.parentId === -1);
        // }
      }
    });
  }
  onSelectedRowsChanged(e, args) {
    this.dataset.map(d => (d.isgolden = false));
    this.selectedObjects = [];
    const selectedRow = this.dataViewObj.getItem(args.rows[0]);
    if (selectedRow) {
      selectedRow.isgolden = true;
      this.loadChildRecords(selectedRow.CustomerNo);
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
  loadChildRecords(customerNo) {
    this.customerService.getCustomerChildren(customerNo).subscribe(x => {
      console.log('children', x);
      if (x && x != null) {
        x.forEach(element => {
          element.id = element.ID;
        });
        this.childrenRecords = x;
      } else {
        this.childrenRecords = [];
      }
    });
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
