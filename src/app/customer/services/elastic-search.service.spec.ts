import { TestBed } from '@angular/core/testing';

import { ElasticSearchService } from './elastic-search.service';

describe('ElasticSearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ElasticSearchService = TestBed.get(ElasticSearchService);
    expect(service).toBeTruthy();
  });
});
