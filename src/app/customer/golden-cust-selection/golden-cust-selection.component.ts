import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { Customer } from '../models/customer';
import { RuleColumn } from '../models/rule';
declare var toastr;

@Component({
  selector: 'app-golden-cust-selection',
  templateUrl: './golden-cust-selection.component.html',
  styleUrls: ['./golden-cust-selection.component.scss']
})
export class GoldenCustSelectionComponent implements OnInit {
  selectedColumns: Array<any>;
  targetFieldsValue: Array<RuleColumn>;
  showNextStep = false;
  fieldSelected;
  targetFields: Array<string> = [];
  goldenCustFields: Array<string> = [];
  valueFields: Array<any>;
  @Output() goldenCustSelect: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('closeModal') close;
  errorStep2;
  errorStep1;
  defaultSelectText = 'select One';

  constructor() {}

  ngOnInit() {
    this.targetFields = Customer.getCustomerFields();
    this.goldenCustFields = Customer.getGoldenCustomerFields();
    this.resetModal();
  }

  resetModal() {
    this.selectedColumns = ['', ''];
    // [
    //   { ColumnName: '' },
    //   { ColumnName: '' },
    //   { ColumnName: '' },
    //   { ColumnName: '' }
    // ];
    console.log('selected cols', this.selectedColumns);
    this.targetFieldsValue = [];
    this.valueFields = Customer.getGoldenFieldValueType();
    this.goldenCustFields.forEach(field => {
      this.targetFieldsValue.push({ ColumnName: field, ColumnValue: this.valueFields[0] });
    });
    this.fieldSelected = -1;
    this.showNextStep = false;
    this.errorStep1 = '';
    this.errorStep2 = '';
  }

  storeSelectedField(field) {
    console.log('in store seelcted field');
    const index = this.selectedColumns.findIndex(x => x === '');
    if (index >= 0) {
      this.selectedColumns[index] = field;
    }
    this.fieldSelected = 1;

    console.log('stored fields', this.selectedColumns);
  }

  isSelectedField(colName) {
    const index = this.selectedColumns.findIndex(x => x === colName);
    if (index >= 0) {
      return true;
    }
    return false;
  }

  onSubmitShow() {
    if (this.fieldSelected == -1) {
      this.errorStep1 = 'Please select field(s)';
      // toastr.info();
    } else {
      console.log(this.selectedColumns);
      this.showNextStep = true;
    }
  }

  storeSelectedValue(colName, value) {
    const index = this.targetFieldsValue.findIndex(x => x.ColumnName === colName);
    console.log('in storeSelectedValue', index);
    console.log('this.targetFieldsValue', this.targetFieldsValue);
    console.log(index);
    if (index >= 0) {
      this.targetFieldsValue[index].ColumnValue = value;
    }
  }
  getSelectedValue(colName) {
    const index = this.targetFieldsValue.findIndex(x => x.ColumnName == colName);
    if (index >= 0) {
      return this.targetFieldsValue[index].ColumnValue;
    }
    return this.defaultSelectText;
  }

  onSubmitFinal() {
    const index = this.targetFieldsValue.findIndex(
      x => x.ColumnName === '' || x.ColumnValue === this.defaultSelectText
    );
    if (index >= 0) {
      this.errorStep2 = 'Please select value of all fields';
      return;
    }
    console.log('this.selectedColumns.join()', this.selectedColumns.join());
    this.goldenCustSelect.emit({
      groupByCols: this.selectedColumns.join(),
      cols: this.targetFieldsValue
    });
    this.resetModal();
    this.close.nativeElement.click();
  }
}
