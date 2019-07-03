import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualReviewFinalComponent } from './manual-review-final.component';

describe('ManualReviewFinalComponent', () => {
  let component: ManualReviewFinalComponent;
  let fixture: ComponentFixture<ManualReviewFinalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualReviewFinalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualReviewFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
