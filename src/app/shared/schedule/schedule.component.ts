import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import {
  Schedule,
  FrequencyType,
  ScheduleType,
  FrequencyInterval_Weekly
} from 'src/app/customer/models/schedule';
import { RuleType } from 'src/app/customer/models/rule';
import { RuleScheduleService } from 'src/app/customer/services/rule-schedule.service';
import { Router } from '@angular/router';
import { HeaderService } from 'src/app/layout/services/header.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormHelper } from 'src/app/shared/helpers/formHelper';
import { RuleService } from 'src/app/customer/services/rule.service';
declare var toastr;

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit, OnChanges {
  @Input() ruleSetId: any;
  @Input() checkFormValidity: boolean;
  @Input() exportJobSchedule: any;
  @Input() isDeletable: boolean;
  @Output() scheduleData = new EventEmitter<any>();
  @Output() deleteSchedule = new EventEmitter<any>();
  @Output() cancelSchedule = new EventEmitter<any>();
  @Input() isProcessing: boolean;
  _checkFormValidity: boolean;

  checked = false;
  validity: boolean;
  selected;
  form: FormGroup;
  // archivedRules$;
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
    dayOfMonth: 'Select Valid Day of Month from 1 to 31'
  };
  showDeleteBtn = false;
  isCancelAble = false;
  isAdd = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public headerService: HeaderService,
    private ruleScheduleServcie: RuleScheduleService,
    private ruleService: RuleService
  ) { }

  ngOnInit() {
    this.buildForm();
    // this.ruleCount = JSON.parse(localStorage.getItem('rulesCount'));

    this.scheduleTypes = Schedule.getScheduleTypes();
    this.frequencyTypes = Schedule.getFrequencyTypes();
    this.frequencyIntervalWeekly = Schedule.getFrequencyInterval_Weekly();
    if (this.ruleSetId && this.ruleSetId > 0) {
      this.form.patchValue({ exportJobId: null });
      this.getRuleScheduleData(this.ruleSetId);
    }
    if (this.exportJobSchedule) {
      this.form.patchValue({ ruleSetId: null });
      this.updateRuleScheduleData(this.exportJobSchedule);
    }
    // this.route.queryParams.subscribe(params => {
    //   // Defaults to 0 if no query param provided.
    //   this.defaultRuleSetId = +params['ruleId'] || 0;
    //   this.storeService.getCustomerArchivedRules().subscribe(ruleSetLst => {
    //     this.form.patchValue({ ruleSetId: this.defaultRuleSetId });
    //     if (ruleSetLst) {
    //       ruleSetLst.forEach(rulelst => {
    //         if (rulelst.ruleSet.ruleSetId == this.defaultRuleSetId) {
    //           this.selectedRuleSet = rulelst.ruleSet;
    //           this.getRuleScheduleData(rulelst.ruleSet.ruleSetId);
    //         }
    //       });
    //     }
    //   });
    // });
    // this.headerService.setTitle('Job Schedule');
    // this.storeService
    // .getCustomerArchivedRules()
    // .subscribe(a => console.log('archived rules in aside nav', JSON.stringify(a)));
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log('in changes', changes);
    if (changes.ruleSetId) {
      if (this.form) {
        this.form.patchValue({ exportJobId: null });
      }
      if (this.ruleSetId && this.ruleSetId > 0) {
        if (this.isDeletable) {
          this.showDeleteBtn = true;
        }
        this.getRuleScheduleData(this.ruleSetId);
      }
      // this.getRuleScheduleData(this.ruleSetId);
    }
    if (changes['exportJobSchedule'] && this.exportJobSchedule !== undefined && this.form) {

      this.form.patchValue({ ruleSetId: '0' });
     // console.log('this.exportJobSchedule', this.exportJobSchedule);
      if (this.exportJobSchedule === null) {
        this.form.reset();
        this.ScheduleScreenButton = 'SAVE';
        this.isAdd = true;
        if (this.isDeletable) {
          this.showDeleteBtn = false;
        }
        this.isCancelAble = true;
      } else {
        if (this.isDeletable) {
          this.showDeleteBtn = true;
        }
        this.isCancelAble = false;
        this.updateRuleScheduleData(this.exportJobSchedule);
      }
    }
  }

  buildForm() {
    this.form = this.fb.group({
      ruleScheduleId: [''],
      scheduleType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      noEndDate: [false],
      ruleSetId: [''],
      exportJobId: [''],
      frequencyType: ['', Validators.required],
      frequencyInterval: ['', Validators.required],
      startTime: ['', Validators.required],
      dayOfMonth: [''],
      weekDay: [''],
      description: [''],
      isEnabled: [true]
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
  isMonthDayValid() {
    let day = this.form.get('dayOfMonth').value;
    if (day == '' || day == null) {
      return true;
    }
    if (day >= 1 && day <= 31) {
      return true;
    } else {
      return false;
    }
  }
  isEndDateValid() {
    let start = this.form.get('startDate').value;

    if (this.form.get('endDate').value == '' || this.form.get('endDate').value == null) {
      return true;
    }
    if (
      new Date(this.form.get('startDate').value) <=
      new Date(this.form.get('endDate').value)
    ) {
      return true;
    }
    return false;
  }

  isNoEndDate() {
    if (this.form && this.form.get('noEndDate').value) {
      return true;
    } else {
      return false;
    }
  }
  isWeekly() {
    if (
      FrequencyType[this.form.get('frequencyType').value] ==
      FrequencyType.Weekly.toString()
    ) {
      return true;
    }
    return false;
  }
  isMonthly() {
    if (
      FrequencyType[this.form.get('frequencyType').value] ==
      FrequencyType.Monthly.toString()
    ) {
      return true;
    }
    return false;
  }
  isRecurring() {
    if (
      ScheduleType[this.form.get('scheduleType').value] ==
      ScheduleType.Recurring.toString()
    ) {
      return true;
    }
    return false;
  }
  getDedupeCols(ruleColumn) {
    //?
    // TODO commenetd temporarily
    //    return lstOfCols.split(',');
  }

  onFrequecyTypeChange(event) {
    if (this.isWeekly()) {
      this.form.get('weekDay').setValidators(Validators.required);
      this.form.get('weekDay').updateValueAndValidity();
      this.form.get('dayOfMonth').setValidators(null);
      this.form.get('dayOfMonth').updateValueAndValidity();
    } else if (this.isMonthly()) {
      this.form.get('weekDay').setValidators(null);
      this.form.get('weekDay').updateValueAndValidity();
      this.form.get('dayOfMonth').setValidators(Validators.required);
      this.form.get('dayOfMonth').updateValueAndValidity();
    } else {
      this.form.get('weekDay').setValidators(null);
      this.form.get('weekDay').updateValueAndValidity();
      this.form.get('dayOfMonth').setValidators(null);
      this.form.get('dayOfMonth').updateValueAndValidity();
    }
  }
  onScheduleTypeChange(event) {
    if (this.isRecurring()) {
      this.form.get('frequencyType').setValidators(Validators.required);
      this.form.get('frequencyType').updateValueAndValidity();
    } else {
      this.form.get('frequencyType').setValidators(null);
      this.form.get('frequencyType').updateValueAndValidity();
      this.form.patchValue({ frequencyType: '' });
    }
  }
  onEndDateChange(event) {
    if (this.isNoEndDate()) {
      this.form.get('endDate').setValidators(null);
      this.form.get('endDate').updateValueAndValidity();
    } else {
      this.form.get('endDate').markAsUntouched();
      this.form.get('endDate').setValidators(Validators.required);
      this.form.get('endDate').updateValueAndValidity();
    }
    // alert(event.checked);
    // if (!this.isNoEndDate()) {
    //   this.form.patchValue({ endDate: '' });
    //   this.form.get('endDate').setValidators(null);
    //   this.form.get('endDate').updateValueAndValidity();
    // }
    // else {
    //   this.form.get('endDate').setValidators(Validators.required);
    //   this.form.get('endDate').updateValueAndValidity();
    // }
  }
  setValidation() {
    this.onEndDateChange(null);
    this.onScheduleTypeChange(null);
    this.onFrequecyTypeChange(null);
  }

  saveSchedule() {
    this.setValidation();

    const tempDatetime = new Date(this.form.get('startTime').value);

    const freqInterval =
      FrequencyType[this.form.get('frequencyType').value] ==
        FrequencyType.Daily.toString()
        ? '1'
        : FrequencyType[this.form.get('frequencyType').value] ==
          FrequencyType.Weekly.toString()
          ? parseInt(FrequencyInterval_Weekly[this.form.get('weekDay').value])
          : FrequencyType[this.form.get('frequencyType').value] ==
            FrequencyType.Monthly.toString()
            ? this.form.get('dayOfMonth').value
            : 1;

    this.form.patchValue({ frequencyInterval: freqInterval });
    const startTime =
      tempDatetime.getHours() +
      ':' +
      tempDatetime.getMinutes() +
      ':' +
      tempDatetime.getSeconds();
    //;
    //  
    if (!this.form.valid) {
      FormHelper.validateAllFormFields(this.form);
      return;
    }
    const modal = this.form.value;
    modal.startTime = startTime;

    if (!this.isRecurring()) {
      modal.frequencyType = 1;
    } else {
      modal.frequencyType = parseInt(
        FrequencyType[this.form.get('frequencyType').value],
        10
      );
    }
    const startDate = new Date(modal.startDate);
    let endDate = null;
    if (!this.isNoEndDate()) {
      endDate = new Date(modal.endDate);
    }

    // modal.startDate = modal.startDate.toLocaleDateString();
    // modal.endDate = modal.endDate.toLocaleDateString();
    modal.startDate = startDate;
    modal.endDate = endDate;

    this.scheduleData.emit(modal);
  }

  getRuleScheduleData(ruleSetId) {
    this.ruleScheduleServcie
      .getRuleScheduleByRuleSetId(ruleSetId)
      .subscribe(resp => {
        this.form.reset();
        if (resp && resp != null) {
          this.updateRuleScheduleData(resp);
        } else {
          this.ScheduleScreenButton = 'SAVE';
          this.isAdd = true;
        }
      });
  }

  updateRuleScheduleData(resp) {
    if (resp && resp != null) {
      this.form.patchValue(resp);
      if (resp.ruleScheduleId != null) {
        this.ScheduleScreenButton = 'UPDATE';
        this.isAdd = false;
      } else {
        this.ScheduleScreenButton = 'SAVE';
        this.isAdd = true;
      }
      if (this.isRecurring()) {
        // non recurring
        this.form.patchValue({
          frequencyType: FrequencyType[resp.frequencyType]
        });
        if (resp.frequencyType == FrequencyType.Weekly) {
          this.form.patchValue({ frequencyType: 'Weekly' });
          this.form.patchValue({
            weekDay: FrequencyInterval_Weekly[resp.frequencyInterval]
          });
        } else if (resp.frequencyType == FrequencyType.Monthly) {
          this.form.patchValue({ frequencyType: 'Monthly' });
          this.form.patchValue({ dayOfMonth: resp.frequencyInterval });
        } else {
          this.form.patchValue({ frequencyType: 'Daily' });
        }
      }
      if (resp.endDate == null) {
        // no end date
        this.form.patchValue({ noEndDate: true });
      } else {
        this.form.patchValue({ noEndDate: false });
      }
      if (resp.startTime) {
        const hr = resp.startTime.substring(0, 2);
        const min = resp.startTime.substring(3, 5);
        const sec = resp.startTime.substring(6, 8);
        const date = new Date(0, 0, 0, hr, min, sec);
        this.form.patchValue({ startTime: date });
      }

      this.setValidation();
    }
  }


  onCancelClick() {
    this.router.navigate(['/customer/data']);
  }

  deleteScheduleData() {
    this.deleteSchedule.emit(this.form.value);
  }

  cancelScheduleData() {
    this.cancelSchedule.emit();
  }

}
