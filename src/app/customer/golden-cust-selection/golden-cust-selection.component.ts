import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { Customer } from '../models/customer';
declare var toastr;

@Component({
  selector: 'app-golden-cust-selection',
  templateUrl: './golden-cust-selection.component.html',
  styleUrls: ['./golden-cust-selection.component.scss']
})
export class GoldenCustSelectionComponent implements OnInit {
  SelectedColumnName: Array<any>;
  showNextStep = false;
  fieldSelected;
  targetFields: Array<string> = [];
  valueFields: Array<any>;
  @Output() goldenCustField: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('closeModal') close;
  errorStep2;
  errorStep1;

  constructor() {}

  ngOnInit() {
    this.resetModal();
    this.targetFields = Customer.getCustomerFields();
  }

  resetModal() {
    this.SelectedColumnName = [
      { ColumnName: '', ColumnValue: '' },
      { ColumnName: '', ColumnValue: '' },
      { ColumnName: '', ColumnValue: '' },
      { ColumnName: '', ColumnValue: '' }
    ];
    this.valueFields = [{ value: 'History' }, { value: 'Latest' }];
    this.fieldSelected = -1;
    this.showNextStep = false;
    this.errorStep1 =  '';
    this.errorStep2 =  '';
  }

  storeSelectedField(field) {
    let index = this.SelectedColumnName.findIndex(x => x.ColumnName == '');
    if (index >= 0) {
      this.SelectedColumnName[index] = {
        ColumnName: field,
        ColumnValue: ''
      };
    }
    this.fieldSelected = 1;
  }

  isSelectedField(colName) {
    const index = this.SelectedColumnName.findIndex(
      x => x.ColumnName == colName
    );
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
      console.log(this.SelectedColumnName);
      this.showNextStep = true;
    }
  }

  storeSelectedValue(colName, value) {
    let index = this.SelectedColumnName.findIndex(x => x.ColumnName == colName);
    console.log(index);
    if (index >= 0) {
      this.SelectedColumnName[index] = {
        ColumnName: colName,
        ColumnValue: value
      };
    }
  }

  onSubmitFinal() {
    let index = this.SelectedColumnName.findIndex(
      x => x.ColumnName != '' && x.ColumnValue == ''
    );
    if (index >= 0) {
     // toastr.info('Please select value of all fields');
      this.errorStep2 = 'Please select value of all fields';
      return;
    }
    this.resetModal();
    console.log(this.close.nativeElement);
    this.close.nativeElement.click();
    this.goldenCustField.emit({
      Column: this.SelectedColumnName
    });
  }
}
