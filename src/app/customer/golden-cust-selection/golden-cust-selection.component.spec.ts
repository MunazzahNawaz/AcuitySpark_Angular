import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldenCustSelectionComponent } from './golden-cust-selection.component';

describe('GoldenCustSelectionComponent', () => {
  let component: GoldenCustSelectionComponent;
  let fixture: ComponentFixture<GoldenCustSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoldenCustSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoldenCustSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
