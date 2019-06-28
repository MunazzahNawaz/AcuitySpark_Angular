import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldenRowDetailViewComponent } from './golden-row-detail-view.component';

describe('GoldenRowDetailViewComponent', () => {
  let component: GoldenRowDetailViewComponent;
  let fixture: ComponentFixture<GoldenRowDetailViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoldenRowDetailViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoldenRowDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
