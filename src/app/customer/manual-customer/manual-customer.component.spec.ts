import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualCustomerComponent } from './manual-customer.component';

describe('ManualCustomerComponent', () => {
  let component: ManualCustomerComponent;
  let fixture: ComponentFixture<ManualCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
