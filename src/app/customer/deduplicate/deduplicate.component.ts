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
  similartyColumns: Array<any>;
  selectedGroupSortType = 'Select Field';
  @Output() dedupRules = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {
    this.resetModal();
    this.targetFields = Customer.getGoldenCustomerFields();
    this.getMatchTypes();
  }
  resetModal() {
    this.selectedMatchType = MatchType.Exact;
    // default 4 cols
    this.dedupColumns = [
      { ColumnName: '', ColumnValue: '' },
      { ColumnName: '', ColumnValue: '' },
      { ColumnName: '', ColumnValue: '' },
      { ColumnName: '', ColumnValue: '' }
    ];
    this.similartyColumns = [
      { ColumnName: '', ColumnValue: '' },
      { ColumnName: '', ColumnValue: '' }
    ];
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
    const index = this.dedupColumns.findIndex(x => x.ColumnName == '');
    if (index < 0) {
      // no empty column already exists
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
  isSelectedSortField(colName) {
    const index = this.similartyColumns.findIndex(x => x.ColumnName == colName);

    if (index >= 0 || this.selectedGroupSortType == colName) {
      return true;
    }
    return false;
  }

  sortField(colName) {
    console.log('colName');
    const index = this.similartyColumns.findIndex(x => x.ColumnName == colName);
    if (index >= 0) {
      return true;
    }
    return false;
  }
  onSubmit() {
    console.log('in submit');
    if (this.selectedMatchType == 'Exact') {
      console.log(this.dedupColumns);
      // const index = this.dedupColumns.findIndex(x => x.ColumnName == '');
      // if (index >= 0) {
      //   this.dedupColumns.splice(index, 1); // remove empty rule
      // }
      const dedupColumns = this.dedupColumns.filter(x => x.ColumnName !== '');
      localStorage.setItem('dedupColumns', JSON.stringify(dedupColumns));
      console.log('dedup', dedupColumns);
      this.dedupRules.emit({
        MatchType: this.selectedMatchType,
        Columns: dedupColumns,
        sortColumn: ''
      });
    } else {
      // const index = this.dedupColumns.findIndex(x => x.ColumnName == '');
      // if (index >= 0) {
      //   this.dedupColumns.splice(index, 1); // remove empty rule
      // }
      const sortColumns = this.similartyColumns.filter(
        x => x.ColumnName !== ''
      );
      console.log('dedup', sortColumns);
      this.dedupRules.emit({
        MatchType: this.selectedMatchType,
        Columns: sortColumns,
        sortColumn: this.selectedGroupSortType
      });
    }

    this.resetModal();
  }

  storeMatchType(type) {
    this.selectedMatchType = type;
  }

  storeGroupStoreType(type) {
    this.selectedGroupSortType = type;
  }

  storeExactCustomerField(field) {
    const index = this.dedupColumns.findIndex(x => x.ColumnName == '');
    if (index >= 0) {
      this.dedupColumns[index] = {
        ColumnName: field,
        ColumnValue: ''
      };
    }
  }

  storeSimilarityCustomerField(field) {
    const index = this.similartyColumns.findIndex(x => x.ColumnName == '');
    if (index >= 0) {
      this.similartyColumns[index] = {
        ColumnName: field,
        ColumnValue: ''
      };
    }
  }
}
