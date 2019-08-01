import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { RuleColumn, Rule, RuleType, RuleStatus, GoldenFieldValueType } from '../models/rule';
import { Customer, PersonalInfoFields, ContactInfoFields, OtherFields } from '../models/customer';
import { HeaderService } from 'src/app/layout/services/header.service';
import { StoreService } from '../services/store.service';
import { Router } from '@angular/router';
declare var toastr;

@Component({
  selector: 'app-golden-cust-full',
  templateUrl: './golden-cust-full.component.html',
  styleUrls: ['./golden-cust-full.component.scss']
})
export class GoldenCustFullComponent implements OnInit {
  // selectedColumns: Array<any>;
  targetFieldsValue: Array<RuleColumn>;
  showNextStep = false;
  fieldSelected;
  targetFields: Array<string> = [];
  goldenCustFields: Array<string> = [];
 // goldenCustDetailFields: Array<string> = [];
  personalInfoFields: Array<string> = [];
  contactInfoFields: Array<string> = [];
  otherFields: Array<string> = [];
  valueFields: Array<any>;
  @Output() goldenCustSelect: EventEmitter<any> = new EventEmitter<any>();
  errorStep2;
  errorStep1;
  defaultSelectText = 'select One';
  defaultValue = GoldenFieldValueType[GoldenFieldValueType.NA].toString();
  rules: Array<Rule> = [];

  constructor(
    private headerService: HeaderService,
    private storeService: StoreService,
    private router: Router
  ) {}

  ngOnInit() {
    this.storeService.getCustomerRules().subscribe(r => {
      this.rules = r;
      console.log('rules on golden page', r);
    });
    this.headerService.setTitle('Customer Golden Record Rule');
    this.targetFields = Customer.getCustomerFields();
    this.goldenCustFields = Customer.getGoldenCustomerFields();
    this.personalInfoFields = Customer.getEnumFields(PersonalInfoFields);
    console.log('this.personalfields', this.personalInfoFields);
    this.contactInfoFields = Customer.getEnumFields(ContactInfoFields);
    this.otherFields = Customer.getEnumFields(OtherFields);
    this.resetModal();
  }

  resetModal() {
    // this.selectedColumns = ['', '', '', ''];
   // console.log('selected cols', this.selectedColumns);
    this.targetFieldsValue = [];
    this.valueFields = Customer.getGoldenFieldValueType();
    this.personalInfoFields.forEach(field => {
      this.targetFieldsValue.push({
        columnName: field,
        columnValue: this.defaultValue
      });
    });
    this.contactInfoFields.forEach(field => {
      this.targetFieldsValue.push({
        columnName: field,
        columnValue: this.defaultValue
      });
    });
    this.otherFields.forEach(field => {
      this.targetFieldsValue.push({
        columnName: field,
        columnValue: this.defaultValue
      });
    });
    this.fieldSelected = -1;
    this.showNextStep = false;
    this.errorStep1 = '';
    this.errorStep2 = '';
  }

  // storeSelectedField(field, index) {
  //   console.log('in store selected field ', field);
  //   console.log('in store selected field index ', index);
  //   // const index = this.selectedColumns.findIndex(x => x === '');
  //   // if (index >= 0) {
  //   this.selectedColumns[index] = field;
  //   // }
  //   this.fieldSelected = 1;

  //   //  console.log('stored fields', this.selectedColumns);
  // }
  // removeSelectedField(field) {
  //   const index = this.selectedColumns.findIndex(x => x === field);
  //   if (index >= 0) {
  //     this.selectedColumns[index] = '';
  //   }

  //   console.log('stored fields', this.selectedColumns);
  // }

  // isSelectedField(colName) {
  //   const index = this.selectedColumns.findIndex(x => x === colName);
  //   if (index >= 0) {
  //     return true;
  //   }
  //   return false;
  // }
  storeSelectedValue(colName, value) {
    const index = this.targetFieldsValue.findIndex(
      x => x.columnName === colName
    );
    console.log('in storeSelectedValue', index);
    console.log('this.targetFieldsValue', this.targetFieldsValue);
    console.log(index);
    if (index >= 0) {
      this.targetFieldsValue[index].columnValue = value;
    }
  }
  getSelectedValue(colName) {
    const index = this.targetFieldsValue.findIndex(
      x => x.columnName == colName
    );
    if (index >= 0) {
      return this.targetFieldsValue[index].columnValue;
    }
    return this.defaultSelectText;
  }
  setPersonalDefaultValue(value) {
    this.personalInfoFields.forEach(colName => {
      const index = this.targetFieldsValue.findIndex(
        x => x.columnName === colName
      );
      if (index >= 0) {
        this.targetFieldsValue[index].columnValue = value;
      }
    });
  }
  setContactDefaultValue(value) {
    this.contactInfoFields.forEach(colName => {
      const index = this.targetFieldsValue.findIndex(
        x => x.columnName === colName
      );
      if (index >= 0) {
        this.targetFieldsValue[index].columnValue = value;
      }
    });
  }
  setOtherDefaultValue(value) {
    this.otherFields.forEach(colName => {
      const index = this.targetFieldsValue.findIndex(
        x => x.columnName === colName
      );
      if (index >= 0) {
        this.targetFieldsValue[index].columnValue = value;
      }
    });
  }

  onSubmitFinal() {
    // if (this.fieldSelected == -1) {
    //   toastr.info('Please select field(s) for grouping');
    //   return;
    // }
    const index = this.targetFieldsValue.findIndex(
      x => x.columnName === '' || x.columnValue === GoldenFieldValueType[this.defaultValue]
    );
    if (index >= 0) {
      toastr.info('Please select value of all fields');
      return;
    }
  //  console.log('this.selectedColumns.join()', this.selectedColumns.join());
    console.log('target fields Value', this.targetFieldsValue);

    let dedupCols = JSON.parse(localStorage.getItem('dedupColumns'));
    let grpCols = '';
    dedupCols.forEach(col => {
      grpCols += col.ColumnName + ',';
    });
    console.log('grpCols', grpCols);
    this.setGoldenRule(this.targetFieldsValue, dedupCols);
    this.resetModal();
    // this.close.nativeElement.click();
    this.router.navigate(['/customer/data']);
  }

  setGoldenRule(cols, groupByCols) {
    console.log('golden new rule', event);
    this.rules.push({
      type: RuleType.goldenCustomer,
      columns: cols,
      detail: 'Golden Customer rule',
      status: RuleStatus.Pending,
      isSelected: true,
      sortColumn: groupByCols
    });
    this.storeService.setCustomerGoldenRecordData(this.rules);
  }
  onCancel() {
    this.router.navigate(['/customer/data']);
  }
}
