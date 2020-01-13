import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {FormBuilder} from '@angular/forms';
import { RuleScheduleComponent } from './ruleSchedule.component';
import { Router, ActivatedRoute } from '@angular/router';
import { StoreService } from '../services/store.service';
import { HeaderService } from 'src/app/layout/services/header.service';
import { RuleScheduleService } from '../services/rule-schedule.service';
describe('ScheduleComponent', () => {
  let component: RuleScheduleComponent;
  let fixture: ComponentFixture<RuleScheduleComponent>;
  let router : Router;
  let storeService: StoreService;
  let ruleScheduleServices: RuleScheduleService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleScheduleComponent ]
    })
    .compileComponents();
    component = new  RuleScheduleComponent(new FormBuilder(),new ActivatedRoute(), router,storeService,new HeaderService(),ruleScheduleServices);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have a control for start date ', () => {
    expect(component.form.contains('startDate')).toBeTruthy();
    //expect(component).toBeTruthy();
  });
  it('should make the start date control required ', () => {
  let control= component.form.get('startdate');
   control.setValue('');

   expect(control.valid).toBeFalsy();
  });
});
