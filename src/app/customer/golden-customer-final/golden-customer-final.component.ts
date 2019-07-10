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
import { GoldenRowDetailViewComponent } from '../golden-row-detail-view/golden-row-detail-view.component';
import { GoldRowDetailPreloadComponent } from '../gold-row-detail-preload/gold-row-detail-preload.component';
import { RuleType, RuleStatus } from '../models/rule';

@Component({
  selector: 'app-golden-customer-final',
  templateUrl: './golden-customer-final.component.html',
  styleUrls: ['./golden-customer-final.component.scss']
})
export class GoldenCustomerFinalComponent implements OnInit {
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
  rules: Array<any>;

  constructor(public storeService: StoreService, private router: Router) {}

  ngOnInit(): void {
    this.storeService.getManualCustomerField().subscribe(c => {
      this.sortColumn = c;
      this.loadData();
    });
    this.storeService.getCustomerRules().subscribe(rules => {
      this.rules = rules;
    });
    this.targetFields = Customer.getCustomerFields();
    this.loadGrid();
  }
  loadGrid() {
    this.setColumns();

    this.gridOptions = {
      enableCellNavigation: true,
      autoEdit: false,
      showHeaderRow: false,
      forceFitColumns: false,
      enableRowDetailView: true,
      enablePagination: false,
      enableHeaderMenu: false,
      enableGridMenu: false,
      enableAutoResize: true, // true by default,
      autoHeight: false,
      rowDetailView: {
        process: item => this.getDetailRows(item),
        loadOnce: true,
        // limit expanded row to only 1 at a time
        singleRowExpand: true,
        useRowClick: true,
        panelRows: 3,
        // Preload View Template
        preloadComponent: GoldRowDetailPreloadComponent,
        // ViewModel Template to load when row detail data is ready
        viewComponent: GoldenRowDetailViewComponent
      }
    };
  }

  getDetailRows(item: any) {
    const detailrows = this.masterData.filter(x => x.parentId === item.id);
    // fill the template on async delay
    return new Promise(resolve => {
      const itemDetail = item;
      itemDetail.details = detailrows;
      resolve(itemDetail);
    });
  }

  setColumns() {
    this.columnDefinitions = Customer.getColumns();
  }

  loadData() {
    this.masterData = [];
    this.storeService.getCustomerGoldenRecordData().subscribe(d => {
      if (d && d != null) {
        const tempData = d.sort((a, b) =>
          a[this.sortColumn] > b[this.sortColumn] ? 1 : -1
        );
        this.masterData = JSON.parse(JSON.stringify(tempData));
        if (this.masterData && this.masterData != null) {
          this.dataset = this.masterData.filter(x => x.parentId === -1);
        }
      }
    });
  }
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.angularGrid.slickGrid.setSortColumn(this.sortColumn, true);
    this.gridObj = angularGrid.slickGrid;
    this.dataViewObj = angularGrid.dataView;
  }
  onSubmit() {
    // const totalgrps = this.dataViewObj.getGroups().length;
    const newRule = {
      type: RuleType.goldenCustomer,
      column: this.sortColumn,
      value: '',
      detail: 'Manual Review rule group by ' + this.sortColumn,
      status: RuleStatus.Pending,
      isSelected: true
    };
    this.rules.push(newRule);
    this.storeService.setCustomerRules(this.rules);
    this.router.navigateByUrl('/customer/data');
  }
  onBack() {
    this.router.navigateByUrl('/customer/goldenCust');
    //  console.log('submit', this.goldenRecords);
    this.storeService.setCustomerGoldenRecordData([]);
  }
}
