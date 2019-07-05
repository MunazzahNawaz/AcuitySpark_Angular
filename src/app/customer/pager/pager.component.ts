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
  @Input() totalPages;
  @Input() defaultPageSize;
  @Output() pageChange = new EventEmitter<any>();
  selectedPageSize = 'Show Records';
  description = ' Per Page';

  constructor() {}

  ngOnInit() {
    this.selectedPageSize = this.defaultPageSize + this.description;;
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
}
