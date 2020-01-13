import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReplaceDetail } from '../models/rule';

@Component({
  selector: 'app-replace',
  templateUrl: './replace.component.html',
  styleUrls: ['./replace.component.scss']
})
export class ReplaceComponent implements OnInit {
  replaceWith = '';
  replaceStr = '';
  modalTitle = 'Replace';
  replaceStrErrMsg = 'Please enter string to be replaced';
  replaceWithErrMsg = 'Please enter string to replace with';
  showError = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ReplaceComponent>) {
  }

  ngOnInit() {
    if (!this.data.isReplace) {
      this.modalTitle = 'Remove';
      this.replaceStrErrMsg = 'Please enter string to be removed';
    }
    console.log('this.data.replaceStr', this.data.replaceStr);
    console.log('this.data', this.data);
  }
  isValidReplaceWith() {
    if (this.data.isReplace && this.data.replaceWith == '') {
      return false;
    }
    return true;
  }
  isValidReplaceStr() {
    if (this.data.replaceStr == '') {
      return false;
    }
    return true;
  }
  onCloseClick() {
    this.dialogRef.close();
  }

}
