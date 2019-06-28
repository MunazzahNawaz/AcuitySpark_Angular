import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectGoldenCustComponent } from './select-golden-cust.component';

describe('SelectGoldenCustComponent', () => {
  let component: SelectGoldenCustComponent;
  let fixture: ComponentFixture<SelectGoldenCustComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectGoldenCustComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectGoldenCustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
