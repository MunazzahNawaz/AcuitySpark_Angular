import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldRowDetailPreloadComponent } from './gold-row-detail-preload.component';

describe('GoldRowDetailPreloadComponent', () => {
  let component: GoldRowDetailPreloadComponent;
  let fixture: ComponentFixture<GoldRowDetailPreloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoldRowDetailPreloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoldRowDetailPreloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
