import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { RuleColumn, Rule, RuleType, RuleStatus } from '../models/rule';
import { Customer } from '../models/customer';
import { HeaderService } from 'src/app/layout/services/header.service';
import { StoreService } from '../services/store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-golden-cust-full',
  templateUrl: './golden-cust-full.component.html',
  styleUrls: ['./golden-cust-full.component.scss']
})
export class GoldenCustFullComponent implements OnInit {
  selectedColumns: Array<any>;
  targetFieldsValue: Array<RuleColumn>;
  showNextStep = false;
  fieldSelected;
  targetFields: Array<string> = [];
  goldenCustFields: Array<string> = [];
  goldenCustDetailFields: Array<string> = [];
  valueFields: Array<any>;
  @Output() goldenCustSelect: EventEmitter<any> = new EventEmitter<any>();
  errorStep2;
  errorStep1;
  defaultSelectText = 'select One';
  rules: Array<Rule> = [];

  constructor(
    private headerService: HeaderService,
    private storeService: StoreService,
    private router: Router) {}

  ngOnInit() {
    this.storeService.getCustomerRules().subscribe(r => {
      this.rules = r;
      console.log('rules on golden page', r);
    });
    this.headerService.setTitle('Customer Golden Record Rule');
    this.targetFields = Customer.getCustomerFields();
    this.goldenCustFields = Customer.getGoldenCustomerFields();
    this.goldenCustDetailFields = Customer.getGoldenCustomerDetailFields();
    this.resetModal();
  }

  resetModal() {
    this.selectedColumns = ['', '','',''];
    // [
    //   { ColumnName: '' },
    //   { ColumnName: '' },
    //   { ColumnName: '' },
    //   { ColumnName: '' }
    // ];
    console.log('selected cols', this.selectedColumns);
    this.targetFieldsValue = [];
    this.valueFields = Customer.getGoldenFieldValueType();
    this.goldenCustDetailFields.forEach(field => {
      this.targetFieldsValue.push({ ColumnName: field, ColumnValue: this.valueFields[0] });
    });
    this.fieldSelected = -1;
    this.showNextStep = false;
    this.errorStep1 = '';
    this.errorStep2 = '';
  }

  storeSelectedField(field) {
    console.log('in store selected field');
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
    console.log('target fields Value', this.targetFieldsValue);
    // this.goldenCustSelect.emit({
    //   groupByCols: this.selectedColumns.join(),
    //   cols: this.targetFieldsValue
    // });
    this.setGoldenRule(this.targetFieldsValue, this.selectedColumns.join());
    this.resetModal();
   // this.close.nativeElement.click();
    this.router.navigate(['/customer/data']);
  }

  setGoldenRule(cols, groupByCols) {
    console.log('golden new rule', event);
    this.rules.push({
      Type: RuleType.goldenCustomer,
      Columns: cols,
      Detail: 'Golden Customer rule',
      Status: RuleStatus.Pending,
      IsSelected: true,
      SortColumn: groupByCols
    });
    this.storeService.setCustomerGoldenRecordData(this.rules);
  }
}
