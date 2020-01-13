import { TestBed } from '@angular/core/testing';

import { RuleScheduleService } from './rule-schedule.service';

describe('RuleScheduleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RuleScheduleService = TestBed.get(RuleScheduleService);
    expect(service).toBeTruthy();
  });
});
