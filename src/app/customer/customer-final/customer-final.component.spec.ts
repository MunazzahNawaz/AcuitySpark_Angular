import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerFinalComponent } from './customer-final.component';

describe('CustomerFinalComponent', () => {
  let component: CustomerFinalComponent;
  let fixture: ComponentFixture<CustomerFinalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerFinalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
