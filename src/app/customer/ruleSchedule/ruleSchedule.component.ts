import { Component, OnInit } from '@angular/core';
import { StoreService } from '../services/store.service';
import {
  FrequencyType,
  ScheduleType
} from '../models/schedule';
import { RuleType } from '../models/rule';
import { RuleScheduleService } from '../services/rule-schedule.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService } from 'src/app/layout/services/header.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormHelper } from 'src/app/shared/helpers/formHelper';
import { Time } from '@angular/common';
import { RuleService } from '../services/rule.service';
declare var toastr;
export interface formModal {
  dayOfMonth: string;
  description: string;
  endDate: Date;
  frequencyInterval: number;
  frequencyType: FrequencyType;
  isEnabled: boolean;
  noEndDate: boolean;
  ruleScheduleId: any;
  ruleSetId: any;
  scheduleType: ScheduleType;
  startDate: Date;
  startTime: Time;
  weekDay: string;
}
@Component({
  selector: 'app-ruleSchedule',
  templateUrl: './ruleSchedule.component.html',
  styleUrls: ['./ruleSchedule.component.scss']
})
export class RuleScheduleComponent implements OnInit {
  checked = false;
  validity: boolean;
  selected;
  form: FormGroup;
  selectedRuleSetId;
  // archivedRules$;
  archivedRules;
  formModal: Array<any> = [];
  selectedRuleSet;
  ScheduleScreenButton = 'UPDATE';
  scheduleTypes: Array<any> = [];
  frequencyTypes: Array<any> = [];
  ruleCount: Array<any> = [];
  frequencyIntervalWeekly: Array<any> = [];
  scheduleEnable;
  ruleType = RuleType;
  endDateChange;
  defaultRuleSetId;
  modal1: formModal;
  allCustomerFields = [];
  ValidationMsgs = {
    scheduleType: 'Please specify a schedule type',
    startDate: 'Please specify a valid start date',
    DateRange: 'StartDate must be less than the end date',
    endDate: 'Please specify a valid end date',
    ruleSetId: 'Please select Rule Set',
    frequencyType: 'Select an interval Frequency/Time for your scheduele',
    // frequencyInterval: 'Select Interval',
    startTime: 'Please specify a starting time for your schedule',
    weekDay: 'select Week Day',
    dayOfMonth: 'select Day of Month'
  };
  isProcessing = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService,
    public headerService: HeaderService,
    private ruleScheduleServcie: RuleScheduleService,
    private ruleService: RuleService
  ) { }

  ngOnInit() {
    this.buildForm();
    // this.archivedRules$ = this.storeService.getCustomerArchivedRules();
    this.ruleCount = JSON.parse(localStorage.getItem('rulesCount'));
    this.headerService.setTitle('Job Schedule');

    this.storeService.getUserSettings().subscribe(x => {
      if (x && x != null) {
        this.allCustomerFields = x;
      }
    });

    this.route.queryParams.subscribe(params => {
      // Defaults to 0 if no query param provided.
      this.defaultRuleSetId = +params['ruleId'] || 0;
      this.form.patchValue({ ruleSetId: this.defaultRuleSetId });
      this.storeService.getCustomerArchivedRules().subscribe(ruleSetLst => {
        console.log('IN SCHEDULE COMPO get archive rules', ruleSetLst);
        this.archivedRules = ruleSetLst;
        if (ruleSetLst) {
          let defautlRuleSet;
          if (this.defaultRuleSetId > 0) {
            defautlRuleSet = ruleSetLst.filter(rulelst => rulelst.ruleSet.ruleSetId == this.defaultRuleSetId);
          } else {
            defautlRuleSet = ruleSetLst.filter(rulelst => rulelst.ruleSet.isDefault == 1);
          }

          if (defautlRuleSet != undefined) {
            this.selectedRuleSetId = 111; // any random number just to trigger change on child comp

            setTimeout(() => {
              this.selectedRuleSetId = defautlRuleSet[0].ruleSet.ruleSetId;
              this.form.patchValue({ ruleSetId: this.selectedRuleSetId });
              this.selectedRuleSet = defautlRuleSet[0].ruleSet;
              console.log('schedule form rule set', defautlRuleSet[0].ruleSet);
            }, 100);
            console.log('selectedRuleSetId', this.selectedRuleSetId);
          }
        }

      });
    });
  }
  buildForm() {
    this.form = this.fb.group({
      // ruleScheduleId: [''],
      ruleSetId: ['', Validators.required]
    });
  }

  validationMsg(key) {
    return this.ValidationMsgs[key];
  }
  isValid(key) {
    if (this.form && this.form.get(key)) {
      const control = this.form.get(key);
      if (control.dirty || control.touched) {
        return control.valid;
      }
    }
    return true;
  }

  saveSchedule(modal) {
    // const modal = $event;
    if (!this.form.valid) {
      FormHelper.validateAllFormFields(this.form);
      return;
    }
    if (this.selectedRuleSetId > 0) {
      modal.ruleSetId = this.selectedRuleSetId;
    }
    const ruleSetId = modal.ruleSetId;
    this.selectedRuleSetId = null;
    if (modal.startDate && modal.startDate != null) {
      let startDate = new Date(Date.UTC(modal.startDate.getFullYear(), modal.startDate.getMonth(), modal.startDate.getDate(), modal.startDate.getHours(), modal.startDate.getMinutes()));
      modal.startDate = startDate;
    }
    if (modal.endDate && modal.endDate != null) {
      let endDate = new Date(Date.UTC(modal.endDate.getFullYear(), modal.endDate.getMonth(), modal.endDate.getDate(), modal.endDate.getHours(), modal.endDate.getMinutes()))
      modal.endDate = endDate;
    }
    this.isProcessing = true;
    this.ruleScheduleServcie.setRuleSchedule(modal).subscribe(resp => {
      this.selectedRuleSetId = ruleSetId;
      toastr.success('Schedule updated successfully');
      this.isProcessing = false;
      this.storeService.refreshCustomerArchivedRules();
    });
  }
  onRuleSetChange(event, RuleSets) {
    this.selectedRuleSetId = this.form.get('ruleSetId').value;
    const tempSet = RuleSets.find(x => x.ruleSet.ruleSetId == event.value);
    if (tempSet && tempSet != null) {
      this.selectedRuleSet = tempSet.ruleSet;
    }

    // this.selectedRuleSetId = tempSet.ruleSet.ruleSetId;
    //  this.getRuleScheduleData(tempSet.ruleSet.ruleSetId);
  }

  onCancelClick() {
    this.router.navigate(['/customer/data']);
  }
  getColDisplayName(col) {
    let colDisplayName = col;
    if (this.allCustomerFields) {
      const currentField = this.allCustomerFields.find(x => x.columnDbName == col);
      colDisplayName = (currentField ? currentField.columnDisplayName : col);
      return colDisplayName;
    }
    return colDisplayName;
  }

  deleteRuleSet(ruleSetSchedule) {
    if (this.selectedRuleSet.isDefault) {
      toastr.warning('Can not delete default rule set');
    } else if (ruleSetSchedule.isEnabled) {
      toastr.warning('Can not delete enabled schedule');
    } else {
      this.isProcessing = true;
      console.log('ruleSetSchedule', ruleSetSchedule);
      this.ruleService.deleteScheduleById(ruleSetSchedule.ruleScheduleId).subscribe(resp => {
        toastr.success('Rule set deleted successfully');
        this.isProcessing = false;
        this.storeService.refreshCustomerArchivedRules();
      });
    }
  }
}
