import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.scss']
})
export class SaveComponent implements OnInit {
  saveAs = '';
  error = '';
  // @Output() ruleSaveName = new EventEmitter<any>();
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<SaveComponent>) { }

  ngOnInit() {
  }
  // onSubmit() {
  // //  this.data = this.saveAs;
  //   this.dialogRef.close();
  //   //this.ruleSaveName.emit(this.saveAs);
  // }
  onCloseClick() {
    this.dialogRef.close();
  }
}
