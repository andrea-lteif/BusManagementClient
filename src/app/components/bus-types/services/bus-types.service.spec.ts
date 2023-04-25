import { TestBed } from '@angular/core/testing';

import { BusTypesService } from './bus-types.service';

describe('BusTypesService', () => {
  let service: BusTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
