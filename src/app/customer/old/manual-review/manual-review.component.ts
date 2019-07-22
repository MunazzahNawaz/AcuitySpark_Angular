import { Component, OnInit } from '@angular/core';
import {
  Column,
  GridOption,
  AngularGridInstance,
  FieldType
} from 'angular-slickgrid';
import { StoreService } from '../../services/store.service';
import { Router } from '@angular/router';
import { Customer } from '../../models/customer';
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
      showHeaderRow: false,
      forceFitColumns: false,
      enablePagination: false,
      enableHeaderMenu: false,
      enableGridMenu: false,
      enableRowMoveManager: true,
      gridMenu: {
        iconCssClass: 'move'
      },
      rowMoveManager: {
        onBeforeMoveRows: (e, args) => this.onBeforeMoveRow(e, args),
        onMoveRows: (e, args) => this.onMoveRows(e, args)
      }
    };
  }

  setColumns() {
    const moveCol: Column = {
      id: '#',
      field: '',
      name: '',
      width: 40,
      behavior: 'selectAndMove',
      selectable: false,
      resizable: false,
      cssClass: 'cell-reorder dnd',
      excludeFromExport: true,
      excludeFromColumnPicker: true,
      excludeFromHeaderMenu: true,
      excludeFromGridMenu: true
    };
    this.columnDefinitions.push(moveCol);

    const parentCol: Column = {
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

    const col: Column = {
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
    const tempCols = Customer.getColumns();
    tempCols.forEach(c => {
      this.columnDefinitions.push(c);
    });
  }

  onBeforeMoveRow(e, data) {
    for (let i = 0; i < data.rows.length; i++) {
      // no point in moving before or after itself
      if (
        data.rows[i] === data.insertBefore ||
        data.rows[i] === data.insertBefore - 1
      ) {
        // e.stopPropagation();
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
    this.gridObj.setSelectedRows(selectedRows);
    this.gridObj.invalidate();
    this.gridObj.render();
  }
  loadData() {
    this.masterData = [];
    this.storeService.getcustomerFinalData().subscribe(d => {
      this.masterData = JSON.parse(JSON.stringify(d));
      if (
        this.masterData &&
        this.masterData != null &&
        this.masterData.length > 0
      ) {
        this.dataset = this.masterData;
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
    const newChildClass = 'childRecord';
    const newParentClass = 'goldenRecord';
    return (rowNumber: number) => {
      const item = this.dataViewObj.getItem(rowNumber);
      const meta = previousItemMetadata(rowNumber) || {};
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
    if (args.cell === 2) {
      // child checkbox clicked
      selectedRow.isChild = selectedRow.ischild ? false : true;
      if (selectedRow.isChild) {
        selectedRow.isParent = false;
      }
    } else if (args.cell === 1) {
      // parent checkbox clicked
      selectedRow.isParent = selectedRow.isParent ? false : true;

      if (selectedRow.isParent) {
        selectedRow.isChild = false;
      }
    }

    const metadata = this.metadata(this.dataViewObj.getItemMetadata);
    console.log('metadata', metadata);
    this.dataViewObj.getItemMetadata = metadata;
    this.gridObj.invalidate();
    this.gridObj.render();
  }
  onRowSelectionChange(event, args) {}
  onSubmit() {
    let parentId = -1;
    const parentIds = [];
    this.dataset.forEach(d => {
      if (d.isParent) {
        parentId = d.id;
        parentIds.push({
          parentId: d.id,
          haveChild: 0
        });
        d.parentId = -1;
      } else if (d.isChild) {
        d.parentId = parentId;
      }
    });

    parentIds.forEach(p => {
      this.dataset.forEach(d => {
        if (d.isChild) {
          console.log('chile', d);
          if (d.parentId === p.parentId) {
            p.haveChild = 1;
          }
        }
      });
    });
    console.log('parent child check', parentIds);
    const index = parentIds.findIndex(x => x.haveChild === 0);
    console.log(index);
    if (index < 0) {
      console.log('this.dataset', this.dataset);
      this.storeService.setCustomerManualRecordData(this.dataset);
      this.router.navigateByUrl('/customer/manualFinal');
    } else {
      toastr.info('You have not selected child of all Golden Records');
    }
  }
  onCancel() {
    console.log('submit', this.goldenRecords);
    this.storeService.setCustomerManualRecordData([]);
    this.router.navigateByUrl('/customer/data');
  }
}
