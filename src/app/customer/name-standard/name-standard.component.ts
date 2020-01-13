import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RuleService } from '../services/rule.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-name-standard',
  templateUrl: './name-standard.component.html',
  styleUrls: ['./name-standard.component.scss']
})
export class NameStandardComponent implements OnInit {
  columns = [
    { id: 'fromName', displayName: 'Nick Name' },
    { id: 'toName', displayName: 'Standard Name' }];

  dataSet = [];
  isAdd = false;
  isEdit = false;
  fromName = '';
  toName = '';
  isActive = '';
  editRow;
  loggedInUser = '';
  msg = '';
  ValidationMsgs: { [id: string]: { isError: number, error: string } } = {};
  isDelete = false;
  deleteRow;
  showFilter = false;
  filterToName = '';
  filterFromName = '';
  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NameStandardComponent>,
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
    this.ValidationMsgs['fromName'] = { isError: 0, error: 'Please enter value to be standardized' };
    this.ValidationMsgs['toName'] = { isError: 0, error: 'Please enter text to be updated' };
    this.ValidationMsgs['field'] = { isError: 0, error: 'Please select field' };
  }

  isValid(modal) {
    let isvalidFlag = true;
    console.log('modal', modal);
    if (!modal.fromName || modal.fromName == '') {
      this.ValidationMsgs.fromName.isError = 1;
      isvalidFlag = false;
      console.log('in valid due to fromName');
    } else {
      this.ValidationMsgs.fromName.isError = 0;
    }
    if (!modal.toName || modal.toName == '') {
      this.ValidationMsgs.toName.isError = 1;
      isvalidFlag = false;
      console.log('in valid due to toName');
    } else {
      this.ValidationMsgs.toName.isError = 0;
    }

    return isvalidFlag;
  }
  refreshData() {
    const modal = {
      filters: {
        toName: this.filterToName,
        fromName: this.filterFromName
      },
      pageNumber: this.currentPage,
      pageSize: this.pageSize
    };
    this.ruleService.getNameSynonyms(modal).subscribe(resp => {
      console.log('resp', resp);
      this.dataSet = resp.nameSynonymsList;
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
    this.filterFromName = '';
    this.filterToName = '';
    this.refreshData();
  }
  isFilterRow(row) {
    if (this.filterFromName != '' || this.filterToName != '') {
      if ((this.filterFromName == '' || row.fromName.includes(this.filterFromName)) &&
        (this.filterToName == '' || row.toName.includes(this.filterToName))
      ) {
        return true;
      } else {
        return false;
      }
    }
    return true;
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
      this.ruleService.saveNameSynonyms(modal).subscribe(resp => {
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
      fromName: this.fromName,
      toName: this.toName,
      valueType: null,
      isActive: true,
      createdBy: this.loggedInUser,
      createdDate: currentDate,
      modifiedBy: null,
      modifiedDate: null,
      removeDate: null,
      removeBy: null
    };
    this.fromName = '';
    this.toName = '';
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
    console.log('in delete row id', this.deleteRow);
    // setTimeout(() => {
    //   const elmnt = document.getElementById('deleteRow');
    //   console.log('element', elmnt);
    //   elmnt.focus();
    //  // elmnt.scrollIntoView();
    // }, 100);
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

    this.ruleService.saveNameSynonyms(modal).subscribe(resp => {
      console.log('save response', resp);
      this.refreshData();
      this.msg = 'Removed Successfully';
      setTimeout(() => {
        this.msg = '';
      }, 3000);
    });
  }
}
