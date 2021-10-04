import {TestBed} from '@angular/core/testing';

import {EntityImports} from '../../../entity.imports';
import {STACK_PERSISTENCE_POUCHDB} from '../../../entity.module';
import {EntityProviders} from '../../../entity.providers';
import {StacksPouchdbService} from './stacks-pouchdb.service';

describe('StacksPouchdbService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [],
    imports: [EntityImports],
    providers: [EntityProviders, {provide: STACK_PERSISTENCE_POUCHDB}],
  }));

  xit('should be created', () => {
    const service: StacksPouchdbService = TestBed.get(StacksPouchdbService);
    expect(service).toBeTruthy();
  });
});
