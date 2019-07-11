import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { StoreService } from 'src/app/customer/services/store.service';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss']
})
export class AsideComponent implements OnInit {
  // isCollapsed = true;
  @Input() enableDedupe: boolean;
  @Input() enableGoldenRecord: boolean;
  @Input() enableHistory: boolean;
  @Input() enableManualReview: boolean;
  @Input() enableExport: boolean;

  @Output() deduplicate = new EventEmitter<any>();
  @Output() goldenRule = new EventEmitter<any>();
  @Output() history = new EventEmitter<any>();
  @Output() manualReview = new EventEmitter<any>();
  @Output() export = new EventEmitter<any>();
  @Output() showArchiveRule = new EventEmitter<any>();

  archivedRules$;
  constructor(private storeService: StoreService) {}

  ngOnInit() {
    this.archivedRules$  = this.storeService.getCustomerArchivedRules();
    this.storeService.getCustomerArchivedRules().subscribe(a => console.log('archived rules in aside nav', a));
  }

  archiveRuleClick(rule) {
    console.log('archive rule click', rule);
    this.showArchiveRule.emit(rule);
  }
  dedupClick() {
    this.deduplicate.emit();
  }
  goldenRuleClick() {
    this.goldenRule.emit();
  }
  historyClick() {
    this.history.emit();
  }
  manualReviewClick() {
    this.manualReview.emit();
  }
  exportClick() {
    this.export.emit();
  }
  importClick() {
  }
  toggleMenu() {
    let sidebar = document.querySelector('.sidebar');
    let bodyWrapper = document.querySelector('.body-wrapper');
    bodyWrapper.classList.toggle('move');
    sidebar.classList.toggle('fliph');
  }
  // collapseClick() {
  //   this.dedupClick.emit();
  // }
}
