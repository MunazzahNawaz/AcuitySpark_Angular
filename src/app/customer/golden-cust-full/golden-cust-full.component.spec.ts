import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldenCustFullComponent } from './golden-cust-full.component';

describe('GoldenCustFullComponent', () => {
  let component: GoldenCustFullComponent;
  let fixture: ComponentFixture<GoldenCustFullComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoldenCustFullComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoldenCustFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
