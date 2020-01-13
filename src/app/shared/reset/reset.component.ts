import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ResetComponent>) { }

ngOnInit() {
}
onCloseClick() {
  this.dialogRef.close();
}

}
