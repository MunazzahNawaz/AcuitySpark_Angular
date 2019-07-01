import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Customer } from '../models/customer';
import { MatchType } from '../models/rule';

@Component({
  selector: 'app-deduplicate',
  templateUrl: './deduplicate.component.html',
  styleUrls: ['./deduplicate.component.scss']
})
export class DeduplicateComponent implements OnInit {
  targetFields: Array<string> = [];
  matchTypes: Array<any> = [];
  matchTypeEnum = MatchType;
  selectedMatchType;
  // isPrecision = false;
  dedupColumns: Array<any>;
  @Output() dedupRules = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {
    this.resetModal();
    this.targetFields = Customer.getCustomerFields();
    this.getMatchTypes();
  }
  resetModal() {
    this.selectedMatchType = MatchType.Exact;
    // default 4 cols
    this.dedupColumns = [{ ColumnName: '', Precision: '' },{ ColumnName: '', Precision: '' },{ ColumnName: '', Precision: '' },{ ColumnName: '', Precision: '' }];
  }
  public getMatchTypes() {
    for (const key of Object.keys(MatchType)) {
      this.matchTypes.push(MatchType[key]);
    }
    console.log('matchTypes', this.matchTypes);
  }
  // onMatchTypeChange(matchType) {
  //   if (matchType == MatchType.Precision) {
  //     this.isPrecision = true;
  //   } else {
  //     this.isPrecision = false;
  //   }
  // }
  onColumnChange(colName) {
    let index = this.dedupColumns.findIndex(x => x.ColumnName == '');
    if (index < 0) { // no empty column already exists
      this.dedupColumns.push({ ColumnName: '', Precision: '' });
    }
    console.log('dedupColumns', this.dedupColumns);
  }
  onPrecisionChange(column, precision) {
    console.log('column', column);
    console.log('precision', precision);
  }
  isSelectedField(colName) {
    const index = this.dedupColumns.findIndex(x => x.ColumnName == colName);
    if (index >= 0) {
      return true;
    }
    return false;
  }
  onSubmit() {
    console.log('in submit');
    // const index = this.dedupColumns.findIndex(x => x.ColumnName == '');
    // if (index >= 0) {
    //   this.dedupColumns.splice(index, 1); // remove empty rule
    // }
    const dedupColumns = this.dedupColumns.filter( x => x.ColumnName !== '');
    console.log('dedup', dedupColumns);
    this.dedupRules.emit({
      MatchType: this.selectedMatchType,
      Columns: dedupColumns
    });
    this.resetModal();
  }
}
