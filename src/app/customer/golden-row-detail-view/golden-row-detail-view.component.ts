import { Component, OnInit } from '@angular/core';
import { Customer } from '../models/customer';

@Component({
  selector: 'app-golden-row-detail-view',
  templateUrl: './golden-row-detail-view.component.html',
  styleUrls: ['./golden-row-detail-view.component.scss']
})
export class GoldenRowDetailViewComponent implements OnInit {
  model: any;
  constructor() {}

  ngOnInit() {
    console.log('in detail row', this.model.details);
  }
}
