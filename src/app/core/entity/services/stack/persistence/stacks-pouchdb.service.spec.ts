import {TestBed} from '@angular/core/testing';

import {StacksPouchdbService} from './stacks-pouchdb.service';

describe('StacksPouchdbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StacksPouchdbService = TestBed.get(StacksPouchdbService);
    expect(service).toBeTruthy();
  });
});
