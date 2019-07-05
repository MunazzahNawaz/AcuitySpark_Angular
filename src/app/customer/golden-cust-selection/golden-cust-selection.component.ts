import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Customer } from '../models/customer';
declare var toastr;

@Component({
  selector: 'app-golden-cust-selection',
  templateUrl: './golden-cust-selection.component.html',
  styleUrls: ['./golden-cust-selection.component.scss']
})
export class GoldenCustSelectionComponent implements OnInit {
  SelectedColumnName: Array<any>;
  showModal;
  fieldSelected;
  targetFields: Array<string> = [];
  valueFields : Array<any>;
  @Output() goldenCustField: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('closeModal') close;
  error='';

  constructor() { }

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
    this.valueFields = [
      {value : 'History'},
      {value : 'Latest'}
    ];
    this.fieldSelected = -1;
    this.showModal = false;
    this.error = '';
  }

  storeSelectedField(field){
     let index = this.SelectedColumnName.findIndex(x => x.ColumnName == '');
     if(index>=0)
     {
       this.SelectedColumnName[index] = {
         'ColumnName': field,
         'ColumnValue' : ''
       };
     }
     this.fieldSelected = 1;
  }

  isSelectedField(colName) {
    const index = this.SelectedColumnName.findIndex(x => x.ColumnName == colName);
    if (index >= 0) {
      return true;
    }
    return false;
  }

  onSubmitShow()
  {
    if(this.fieldSelected == -1)
    {
      toastr.info('please select field');
    }
    else
    {
      this.showModal = !this.showModal;
      console.log(this.showModal);
    }
  }

  showPrevious()
  {
    this.showModal = false;
  }
  storeSelectedValue(colName,value){
     let index = this.SelectedColumnName.findIndex(x => x.ColumnName == colName);
     console.log(index);
     if(index>=0)
     {
       this.SelectedColumnName[index] = {
         'ColumnName': colName,
         'ColumnValue' : value
       };
     }
  }

  onSubmitFinal()
  {
    let index = this.SelectedColumnName.findIndex(x => x.ColumnName != '' && x.ColumnValue == '');
    if(index >= 0)
    {
      this.error = "Please select value of all fields";
      return;
    }console.log( this.close.nativeElement);
    this.close.nativeElement.click();
    this.goldenCustField.emit({
      Column: this.SelectedColumnName
    });
    this.resetModal();
  }
}
