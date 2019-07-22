import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualReviewComponent } from './manual-review.component';

describe('ManualReviewComponent', () => {
  let component: ManualReviewComponent;
  let fixture: ComponentFixture<ManualReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
