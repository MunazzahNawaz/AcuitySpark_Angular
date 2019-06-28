import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldenCustomerFinalComponent } from './golden-customer-final.component';

describe('GoldenCustomerFinalComponent', () => {
  let component: GoldenCustomerFinalComponent;
  let fixture: ComponentFixture<GoldenCustomerFinalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoldenCustomerFinalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoldenCustomerFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
