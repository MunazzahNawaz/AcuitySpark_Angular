import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RuleService } from '../services/rule.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-address-standard',
  templateUrl: './address-standard.component.html',
  styleUrls: ['./address-standard.component.scss']
})
export class AddressStandardComponent implements OnInit {
  columns = [
    { id: 'fromValue', displayName: 'From Value' },
    { id: 'toValue', displayName: 'To Value' },
    { id: 'field', displayName: 'Field' }];

  dataSet = [];
  isAdd = false;
  isEdit = false;
  fromValue = '';
  toValue = '';
  field = '';
  isActive = '';
  editRow;
  loggedInUser = '';
  msg = '';
  ValidationMsgs: { [id: string]: { isError: number, error: string } } = {};
  isDelete = false;
  deleteRow;
  showFilter = false;
  filterToValue = '';
  filterFromValue = '';
  filterfield = '';
  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddressStandardComponent>,
    private ruleService: RuleService,
    private authService: AuthService,
    protected spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.authService.getIsLoginReady().subscribe(isLoggedIn => {
      if (isLoggedIn != null && isLoggedIn == true) {
        this.loggedInUser = this.authService.getEmail();
      }
    });

    this.refreshData();
    this.setErrorMsgs();

  }
  setErrorMsgs() {
    this.ValidationMsgs['fromValue'] = { isError: 0, error: 'Please enter value to be standardized' };
    this.ValidationMsgs['toValue'] = { isError: 0, error: 'Please enter text to be updated' };
    this.ValidationMsgs['field'] = { isError: 0, error: 'Please select field' };
  }

  isValid(modal) {
    let isvalidFlag = true;
    console.log('modal', modal);
    if (!modal.fromValue || modal.fromValue == '') {
      this.ValidationMsgs.fromValue.isError = 1;
      isvalidFlag = false;
      console.log('in valid due to fromValue');
    } else {
      this.ValidationMsgs.fromValue.isError = 0;
    }
    if (!modal.toValue || modal.toValue == '') {
      this.ValidationMsgs.toValue.isError = 1;
      isvalidFlag = false;
      console.log('in valid due to toValue');
    } else {
      this.ValidationMsgs.toValue.isError = 0;
    }
    if (!modal.field || modal.field == '') {
      this.ValidationMsgs.field.isError = 1;
      isvalidFlag = false;
      console.log('in valid due to field');
    } else {
      this.ValidationMsgs.field.isError = 0;
    }

    return isvalidFlag;
  }
  refreshData() {
    const modal = {
      filters: {
        field: this.filterfield,
        toValue: this.filterToValue,
        fromValue: this.filterFromValue
      },
      pageNumber: this.currentPage,
      pageSize: this.pageSize
    };
    this.ruleService.getAddressStandardization(modal).subscribe(resp => {
      console.log('resp', resp);
      this.dataSet = resp.fieldStandardizationList;
      this.totalRecords = resp.totalCount;
      this.spinner.hide();
    });
  }
  pageChanged(event) {
    this.refreshData();
  }

  onFilterChange() {
    this.refreshData();
  }
  onFilter() {
    this.showFilter = !this.showFilter;
  }
  onResetFilter() {
    this.filterFromValue = '';
    this.filterToValue = '';
    this.filterfield = '';
    this.refreshData();
  }
  onCloseClick() {
    this.dialogRef.close();
  }
  onEdit(row) {
    console.log('row', row);
    this.editRow = Object.assign({}, row);
    this.isEdit = true;
  }
  onAdd() {
    this.isAdd = true;
    setTimeout(() => {
      const elmnt = document.getElementById('addRow');
      console.log('element', elmnt);
      //  elmnt.scrollIntoView();
      elmnt.focus();
    }, 100);

  }
  isFilterRow(row) {
    if (this.filterFromValue != '' || this.filterToValue != '' || this.filterfield != '') {
      if ((this.filterFromValue == '' || row.fromValue.includes(this.filterFromValue)) &&
        (this.filterToValue == '' || row.toValue.includes(this.filterToValue)) &&
        (this.filterfield == '' || row.field.includes(this.filterfield))) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }

  onSave(currentRow) {
    let modal = {};
    if (this.isAdd) {
      modal = this.addNew();
    }
    if (this.isEdit) {
      modal = this.update(currentRow);
    }
    console.log('in save is valid', this.isValid(modal));
    if (this.isValid(modal)) {
      this.ruleService.saveAddressStandardization(modal).subscribe(resp => {
        console.log('save response', resp);
        this.refreshData();
        this.msg = 'Saved Successfully';
        this.isAdd = false;
        this.isEdit = false;
        setTimeout(() => {
          this.msg = '';
        }, 3000);
      });

    }

  }
  addNew() {
    const currentDate = new Date();
    const modal = {
      id: 0,
      fromValue: this.fromValue,
      toValue: this.toValue,
      valueType: null,
      field: this.field,
      isActive: true,
      createdBy: this.loggedInUser,
      createdDate: currentDate,
      modifiedBy: null,
      modifiedDate: null,
      removeDate: null,
      removeBy: null
    };
    this.fromValue = '';
    this.toValue = '';
    this.field = '';
    console.log('add new modal', JSON.stringify(modal));
    return modal;

  }
  update(currentRow) {
    currentRow = this.editRow;
    console.log('edit row', this.editRow);
    console.log('current row', currentRow);
    const currentDate = new Date();
    const modal = this.editRow;
    modal.modifiedBy = this.loggedInUser;
    modal.modifiedDate = currentDate;
    console.log('update modal', JSON.stringify(modal));
    return modal;
  }
  onCancel(row) {
    console.log('old Row', row);
    console.log('Edit Row', this.editRow);
    this.isAdd = false;
    this.isEdit = false;
  }
  onDelete(row) {
    this.deleteRow = row;
    this.isDelete = true;
  //   setTimeout(() => {
  //     const elmnt = document.getElementById('deleteRow');
  //     console.log('element', elmnt);
  //  //   elmnt.scrollIntoView();
  //     elmnt.focus();
  //   }, 100);
  }
  onDeleteCancel() {
    this.isDelete = false;
    this.deleteRow = undefined;
  }
  onDeleteConfirm() {
    this.isDelete = false;
    const modal = this.deleteRow;
    const currentDate = new Date();
    modal.removeBy = this.loggedInUser;
    modal.isActive = false;
    modal.removeDate = currentDate;
    console.log('delete modal', JSON.stringify(modal));

    this.ruleService.saveAddressStandardization(modal).subscribe(resp => {
      console.log('save response', resp);
      this.refreshData();
      this.msg = 'Removed Successfully';
      setTimeout(() => {
        this.msg = '';
      }, 3000);
    });
  }
}
