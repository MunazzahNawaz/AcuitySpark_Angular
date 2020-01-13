import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements OnInit, OnChanges {
  @Input() pageSizes;
  @Input() totalRecords: string;
  @Input() defaultPageSize;
  @Input() currentPage;
  @Output() pageChange = new EventEmitter<any>();
  totalPages = 50;

  selectedPageSize = 'Show Records';
  description = ' Per Page';

  constructor() {}

  ngOnInit() {
    this.selectedPageSize = this.defaultPageSize + this.description;
    // this.totalPages =
  }

  onPageSizeChange(pageSize) {
    this.pageChange.emit(pageSize);
    this.selectedPageSize = pageSize + this.description;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.defaultPageSize) {
      this.selectedPageSize = this.defaultPageSize + this.description;
    }
  }
  prevPageCLick() {
    this.currentPage = this.currentPage > 1 ? this.currentPage - 1 : this.currentPage;
    //  this.loadData();
  }
  nextPageCLick() {
    this.currentPage = this.currentPage < this.totalPages ? this.currentPage + 1 : this.currentPage;
    //  this.loadData();
  }
  firstPageCLick() {
    this.currentPage = 1;
    // this.loadData();
  }
  lastPageCLick() {
    this.currentPage = this.totalPages;
    // this.loadData();
  }
}
