import { TestBed } from '@angular/core/testing';

import { RowCountService } from './row-count.service';

describe('RowCountService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RowCountService = TestBed.get(RowCountService);
    expect(service).toBeTruthy();
  });
});
