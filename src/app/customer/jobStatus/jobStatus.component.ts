import { Component, OnInit } from '@angular/core';
import { JobStatusService } from '../services/jobStatus.service';
import { Observable } from 'rxjs';
import { HeaderService } from 'src/app/layout/services/header.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-job-status',
  templateUrl: './jobStatus.component.html',
  styleUrls: ['./jobStatus.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class JobStatusComponent implements OnInit {
  constructor(protected statusService: JobStatusService, public headerService: HeaderService) { }
  columnsToDisplay: string[];
  expanded = false;
  selectedId;
  columns = [
    { id: 'ruleSetName', name: 'Rule Set' },
    { id: 'executionDate', name: 'Execution Date' },
    { id: 'startTime', name: 'Start Time' },
    { id: 'endTime', name: 'End Time' },
    { id: 'effectedRows', name: 'Effected Rows' },
    { id: 'status', name: 'Status' },
  ];
  jobStatus$: Observable<any>;
  groupedData = [];
  childData = [];

  ngOnInit() {
    this.columnsToDisplay = this.columns.map(column => column.id);
    this.headerService.setTitle('Job Status');
    this.jobStatus$ = this.statusService.getJobStatus();
    this.headerService.setTitle('Job Status');
    this.groupData();
  }
  groupData() {
    this.groupedData = [];
    this.childData = [];
    let startDateTime;
    let endDateTime;
    let index = -1;
    this.jobStatus$.subscribe(resp => {
      let oldBatchId = -1;
      // this.groupedData = resp.jobStatus;
      resp.jobStatus.forEach(parent => {
        if (parent.batchId != oldBatchId) {
          this.groupedData.push(parent);
          index++;
          if (index > 0) { // not first parent
            // console.log('when index >0', index);
            // console.log('grouped data', this.groupedData);
            // console.log('endDateTime', endDateTime);
            this.groupedData[index - 1].endTime = endDateTime;
            // console.log('this.groupedData[index - 1].endTime', this.groupedData[index - 1].endTime);
          }
          oldBatchId = parent.batchId;
        } else {
          if (parent.status == 'Failed') {
            this.groupedData[index].status = parent.status;
          } else if (parent.status == 'In-Progress') {
            this.groupedData[index].status = parent.status;
          }
          this.groupedData[index].id = this.groupedData[index].id + ',' + parent.id;
        }
        parent.jobStatusDetail.forEach(child => {
          this.childData.push(child);
          // console.log('child endtime', child.endTime);
          // console.log('child', child);
          endDateTime = child.endTime;
        });
      });
      if (this.groupedData.length > 0) {
        this.groupedData[index].endTime = endDateTime;
      }

      // this.groupedData = resp.jobStatus.filter(x => x.isParent == true);
      // this.childData = resp.jobStatus.filter(x => x.isParent == false);

    });

    console.log('grouped data', this.groupedData);

  }
  isEqualDateOnly(srcDate, descDate) {
    const newDate = formatDate(srcDate, 'yyyy-MM-dd', 'en-US');
    const oldDate = formatDate(descDate, 'yyyy-MM-dd', 'en-US');
    if (newDate == oldDate) {
      return true;
    }
    return false;
  }
  onRowClick(rowId) {
    if (this.selectedId == rowId) {// if alreasy open
      this.expanded = !this.expanded;
    } else {
      this.expanded = true;
    }
    // expanded = !expanded
    this.selectedId = rowId;
  }
}
