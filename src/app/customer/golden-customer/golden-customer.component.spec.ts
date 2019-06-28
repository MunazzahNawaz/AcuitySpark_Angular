import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldenCustomerComponent } from './golden-customer.component';

describe('GoldenCustomerComponent', () => {
  let component: GoldenCustomerComponent;
  let fixture: ComponentFixture<GoldenCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoldenCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoldenCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
