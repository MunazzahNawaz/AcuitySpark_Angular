import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressStandardComponent } from './address-standard.component';

describe('AddressStandardComponent', () => {
  let component: AddressStandardComponent;
  let fixture: ComponentFixture<AddressStandardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressStandardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
