import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderService } from 'src/app/layout/services/header.service';
import { StoreService } from '../services/store.service';
import { RuleService } from '../services/rule.service';
import { FilterComponent } from 'src/app/shared/filter/filter.component';
declare var toastr;

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {
  @ViewChild('exportFilters', { static: true }) 'exportFilters': FilterComponent;
  displayedColumns: string[]; // = ['position', 'name', 'weight', 'symbol'];
  columns;
  allCustomerFields: Array<any>;
  isAssignedCols = false;
  customerData = [];
  selectFiltersMain;
  previewDataLength = 100;
  // fileName = 'Customer_';
  allExportJobs: Array<any>;
  defaultText = 'default';
  selectedJob: any;
  //  defaultFilters;
  exportJobSchedule;
  selected = '1';
  isEditForm = true;
  filePath;
  jobName;
  currentSelectedJobId = 0;
  isProcessing = false;

  constructor(
    public headerService: HeaderService,
    public storeService: StoreService,
    private ruleService: RuleService) { }

  ngOnInit() {
    this.headerService.setTitle('Export');
    this.getAllExportJobs();
  }
  getAllExportJobs() {
    this.ruleService.getAllExportJobs().subscribe(jobs => {
      this.allExportJobs = jobs;
      if (jobs != undefined && jobs.length > 0) {
        this.selectedJob = jobs[0];
        if (this.currentSelectedJobId > 0) {
          let currentJob = jobs.filter(j => j.jobId == this.currentSelectedJobId);
          if (currentJob && currentJob.length > 0) {
            this.selectedJob = currentJob[0];
          }
        }
        this.filePath = this.selectedJob.fileLocation;
        this.jobName = this.selectedJob.jobName;
        this.onExportJobChange();
      }
    });
  }

  onExportJobChange() {
    let filters = [];
    this.selectedJob.exportJobDetail.forEach(jobFilter => {
      const filterObj = {
        fieldName: jobFilter.fieldName,
        fieldText: jobFilter.fieldValue,
        operations: jobFilter.operation
      };
      filters.push(filterObj);
    });
    this.selectFiltersMain = {
      filters: filters,
      fromDate: this.selectedJob.fromDate,
      toDate: this.selectedJob.toDate
    };
    this.exportJobSchedule = this.selectedJob.ruleSchedule[0];
    this.filePath = this.selectedJob.fileLocation;
    this.jobName = this.selectedJob.jobName;
  }

  onSaveExport(scheduleModal) {
    const filters = [];
    if (this.exportFilters.validateDateRange()) {
      this.selectFiltersMain = this.exportFilters.getSelectedFilters();
      this.selectFiltersMain.filters.forEach(filter => {
        const filterObj = {
          id: 0,
          jobId: this.selectedJob.jobId,
          fieldName: filter.fieldName,
          fieldValue: filter.fieldText,
          operation: filter.operations
        };
        filters.push(filterObj);
      });
      const exportJobObj = {
        exportJob: {
          jobId: this.selectedJob ? this.selectedJob.jobId : null,
          fromDate: this.selectFiltersMain.fromDate,
          toDate: this.selectFiltersMain.toDate,
          fileLocation: this.filePath,
          jobName: this.jobName
        },
        exportJobDetail: filters,
        ruleSchedule: scheduleModal
      };
      this.isProcessing = true;
      this.ruleService.saveExportJob(exportJobObj).subscribe(resp => {
        this.isEditForm = true;
        this.selectedJob = exportJobObj;
        this.selectedJob.jobId = resp.exportJobId;
        this.currentSelectedJobId = resp.exportJobId;
        this.jobName = this.selectedJob.exportJob.jobName;
        // this.selectedJob.exportJob.jobId = resp.exportJobId;
        this.getAllExportJobs();
          toastr.success('Export job schedule saved successfully');
        this.isProcessing = false;
      });
    }

  }

  onFileComplete(data: any) {
  }

  addNewExportJob() {
    this.isEditForm = false;
    this.selectFiltersMain = null;
    this.selectedJob = {};
    this.exportJobSchedule = null;
    //  this.allExportJobs = [];
    this.filePath = '';
    this.jobName = '';
  }

  deleteExportJob(scheduleData) {
    if (scheduleData.isEnabled) {
      toastr.warning('Can not delete enabled schedule');
    } else {
      this.isProcessing = true
      this.ruleService.deleteExportJob(this.selectedJob.jobId).subscribe(resp => {
        toastr.success('Export job schedule deleted successfully');
        this.currentSelectedJobId = 0;
        this.isProcessing = false;
        this.getAllExportJobs();
      });
    }
  }

  cancelNewJob() {
    this.isEditForm = true;
    this.getAllExportJobs();
  }

  resetJobNameField() {
    this.jobName = '';
  }
}
