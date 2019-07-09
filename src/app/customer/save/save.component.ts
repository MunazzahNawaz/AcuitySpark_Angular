import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.scss']
})
export class SaveComponent implements OnInit {
  saveAs = '';
  error = '';
  @Output() ruleSaveName = new EventEmitter<any>();
  constructor() {}

  ngOnInit() {}
  onSubmit() {
    this.ruleSaveName.emit(this.saveAs);
  }
}
