import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NameStandardComponent } from './name-standard.component';

describe('NameStandardComponent', () => {
  let component: NameStandardComponent;
  let fixture: ComponentFixture<NameStandardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NameStandardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NameStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
