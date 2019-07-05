import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Customer } from '../models/customer';
declare var toastr;

@Component({
  selector: 'app-select-golden-cust',
  templateUrl: './select-golden-cust.component.html',
  styleUrls: ['./select-golden-cust.component.scss']
})
export class SelectGoldenCustComponent implements OnInit {
  targetFields: Array<string> = [];
  matchTypes: Array<any> = [];
  SelectedColumnName;
  dedupColumns: Array<any>;
  @Output() manualCustField = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {
    this.resetModal();
    this.targetFields = Customer.getCustomerFields();
  }
  resetModal() {
    this.SelectedColumnName = '-1';
  }

  // onColumnChange(colName) {
  //   const index = this.dedupColumns.findIndex(x => x.ColumnName == '');
  //   if (index < 0) { // no empty column already exists
  //     this.dedupColumns.push({ ColumnName: '', Precision: '' });
  //   }
  //   console.log('dedupColumns', this.dedupColumns);
  // }

  onSubmit() {
    if (this.SelectedColumnName === '-1') {
      toastr.info('please select field');
      return ;
    }
    console.log('in submit');
    this.manualCustField.emit({
      Column: this.SelectedColumnName
    });
    this.resetModal();
  }

  storeFieldType(field)
  {
    this.SelectedColumnName = field;
  }
}
