import { Component, OnInit } from '@angular/core';
import {
  Column,
  GridOption,
  AngularGridInstance,
  FieldType,
  Editors
} from 'angular-slickgrid';
import { StoreService } from '../services/store.service';
import { Router } from '@angular/router';
import { Customer } from '../models/customer';
declare var toastr;

@Component({
  selector: 'app-manual-review',
  templateUrl: './manual-review.component.html',
  styleUrls: ['./manual-review.component.scss']
})
export class ManualReviewComponent implements OnInit {
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
  // sortColumn;
  goldenRecords: Array<any> = [];

  constructor(public storeService: StoreService, private router: Router) {}

  ngOnInit(): void {
    this.loadData();

    this.targetFields = Customer.getCustomerFields();
    this.loadGrid();
  }
  loadGrid() {
    this.setColumns();

    this.gridOptions = {
      editable: false,
      enableCellNavigation: true,
      enableColumnReorder: false,
      autoEdit: false,
      enableAutoResize: true, // true by default,
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 15
      },
      autoHeight: false,
      enableFiltering: false,
      // enableRowSelection: true,
      // enableCheckboxSelector: true,
      showHeaderRow: false,
      forceFitColumns: false,
      enablePagination: false,
      enableHeaderMenu: false,
      enableGridMenu: false,
      enableRowMoveManager: true,
      gridMenu: {
        iconCssClass: 'fa fa-ellipsis-v',
      },
      rowMoveManager: {
        onBeforeMoveRows: (e, args) => this.onBeforeMoveRow(e, args),
        onMoveRows: (e, args) => this.onMoveRows(e, args)
      },
      // checkboxSelector: {
      //   // remove the unnecessary "Select All" checkbox in header when in single selection mode
      //   hideSelectAllCheckbox: true
      // }
    };
  }

  setColumns() {

    let moveCol: Column = {
      id: '#', field: '', name: '', width: 40,
      behavior: 'selectAndMove',
      selectable: false, resizable: false,
      cssClass: 'cell-reorder dnd',
      excludeFromExport: true,
      excludeFromColumnPicker: true,
      excludeFromHeaderMenu: true,
      excludeFromGridMenu: true
    };
    this.columnDefinitions.push(moveCol);
    
    let parentCol: Column = {
      id: 'golden',
      name: 'Golden',
      field: 'golden',
      sortable: false,
      filterable: false,
      type: FieldType.boolean,
      minWidth: 60
    };
    parentCol.formatter = function checkBoxFormatter(
      row,
      cell,
      value,
      columnDef,
      dataContext
    ) {
      return `<div class="checkbox-gold"><input type="checkbox"><label ></label></div>`;
    };

    this.columnDefinitions.push(parentCol);

    let col: Column = {
      id: 'child',
      name: 'Child',
      field: 'child',
      sortable: false,
      filterable: false,
      type: FieldType.boolean,
      minWidth: 50
    };
    col.formatter = function checkBoxFormatter(
      row,
      cell,
      value,
      columnDef,
      dataContext
    ) {
      return `<div class="checkbox"><input type="checkbox"><label ></label></div>`;
    };

    this.columnDefinitions.push(col);

    this.targetFields.forEach(t => {
      this.columnDefinitions.push({
        id: t,
        name: t,
        field: t,
        sortable: true,
        filterable: false,
        type: FieldType.string,
        editor: { model: Editors.text },
        minWidth: 150
      });
    });
  }

  onBeforeMoveRow(e, data) {
    for (let i = 0; i < data.rows.length; i++) {
      // no point in moving before or after itself
      if (
        data.rows[i] === data.insertBefore ||
        data.rows[i] === data.insertBefore - 1
      ) {
        e.stopPropagation();
        return false;
      }
    }
    return true;
  }

  onMoveRows(e, args) {
    const extractedRows = [];
    let left;
    let right;
    const rows = args.rows;
    const insertBefore = args.insertBefore;
    left = this.dataset.slice(0, insertBefore);
    right = this.dataset.slice(insertBefore, this.dataset.length);
    rows.sort((a, b) => {
      return a - b;
    });

    for (let i = 0; i < rows.length; i++) {
      extractedRows.push(this.dataset[rows[i]]);
    }

    rows.reverse();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (row < insertBefore) {
        left.splice(row, 1);
      } else {
        right.splice(row - insertBefore, 1);
      }
    }
    this.dataset = left.concat(extractedRows.concat(right));
    const selectedRows = [];

    for (let i = 0; i < rows.length; i++) {
      selectedRows.push(left.length + i);
    }

    this.angularGrid.slickGrid.resetActiveCell();
    this.angularGrid.slickGrid.setData(this.dataset);
    this.angularGrid.slickGrid.setSelectedRows(selectedRows);
    this.angularGrid.slickGrid.render();
  }
  loadData() {
    this.masterData = [];
    this.storeService.getcustomerFinalData().subscribe(d => {
      // console.log('in GOLDEN LOAD DATA', d);
      // let tempData = d.sort((a, b) =>
      //   a[this.sortColumn] > b[this.sortColumn] ? 1 : -1
      // );
      // console.log('sorted data', tempData);
      // tempData = this.filterData(tempData);
      this.masterData = JSON.parse(JSON.stringify(d));
      // console.log('temp data', tempData);
      if (
        this.masterData &&
        this.masterData != null &&
        this.masterData.length > 0
      ) {
        this.dataset = this.masterData;
      }
      // else {
      //   toastr.info('No duplicate records base on column: ' + this.sortColumn);
      //   this.router.navigate(['customer/data']);
      // }
    });
  }
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    // this.angularGrid.slickGrid.setSortColumn(this.sortColumn, true);
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
    //  this.groupByField(this.dataViewObj);
    //  this.filterGrid();
    // this.dataViewObj.setFilterArgs({
    //   grps: this.dataViewObj.getGroups
    // });
    this.dataViewObj.getItemMetadata = this.metadata(
      this.dataViewObj.getItemMetadata
    );
    this.gridObj.invalidate();
    this.gridObj.render();
  }

  metadata(previousItemMetadata) {
    const newChildClass = 'childRecord';
    const newParentClass = 'goldenRecord';
    return (rowNumber: number) => {
      const item = this.dataViewObj.getItem(rowNumber);
      let meta = previousItemMetadata(rowNumber) || {};
     // console.log('meta',meta);
      if (meta && item && item.isChild) {
        if (!meta.cssClasses || meta.cssClasses.indexOf(newChildClass) < 0) {
          meta.cssClasses = (meta.cssClasses || '') + ' ' + newChildClass;
        }
      }
      if (meta && item && item.isParent) {
        if (!meta.cssClasses || meta.cssClasses.indexOf(newParentClass) < 0) {
          meta.cssClasses = (meta.cssClasses || '') + ' ' + newParentClass;
        }
      }
      return meta;
    };
  }

  onCellChanged(e, args) {
    console.log('onCellChanged', args);
  }

  onCellClicked(e, args) {
    console.log('onCellClicked', args);
    const selectedRow = this.dataViewObj.getItem(args.row);
    console.log('selected Row', selectedRow);
    if (args.cell == 2) {
      // child checkbox clicked
      selectedRow.isChild = selectedRow.ischild ? false : true;
      if (selectedRow.isChild) {
        selectedRow.isParent = false;
      }
    } else if (args.cell == 1) {
      // parent checkbox clicked
      selectedRow.isParent = selectedRow.isParent ? false : true;

      if (selectedRow.isParent) {
        selectedRow.isChild = false;
      }
    }
    this.dataViewObj.getItemMetadata = this.metadata(
      this.dataViewObj.getItemMetadata
    );
    this.gridObj.invalidate();
    this.gridObj.render();
  }
  onRowSelectionChange(event, args) {
  }
  onSubmit() {
    const totalgrps = this.dataViewObj.getGroups().length;
    const goldenRecords = this.goldenRecords.filter(x => x.parentId == -1);
    if (!goldenRecords || goldenRecords.length <= 0) {
      toastr.info(
        'you have not selected any record. Please select record to move next.'
      );
      return;
    } else if (goldenRecords && goldenRecords.length < totalgrps) {
      if (
        !confirm(
          'you have not selected golden customer for all groups. Are you sure to finalize it?'
        )
      ) {
        return;
      }
    }
  }
  onCancel() {
    console.log('submit', this.goldenRecords);
    // this.storeService.setCustomerGoldenRecordData([]);
    this.router.navigateByUrl('/customer/data');
  }
}
