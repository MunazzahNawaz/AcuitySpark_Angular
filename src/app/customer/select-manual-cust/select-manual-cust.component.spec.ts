import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectManualCustComponent } from './select-manual-cust.component';

describe('SelectManualCustComponent', () => {
  let component: SelectManualCustComponent;
  let fixture: ComponentFixture<SelectManualCustComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectManualCustComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectManualCustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
