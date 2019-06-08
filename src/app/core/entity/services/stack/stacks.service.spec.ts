import {inject, TestBed} from '@angular/core/testing';

import {StacksService} from './stacks.service';
import {EntityImports} from '../../entity.imports';
import {EntityProviders} from '../../entity.providers';
import {STACK_PERSISTENCE_POUCHDB} from '../../entity.module';

describe('StacksPersistenceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [],
    imports: [EntityImports],
    providers: [EntityProviders, {provide: STACK_PERSISTENCE_POUCHDB}]
  }));

  it('should ...', inject([StacksService], (service: StacksService) => {
    expect(service).toBeTruthy();
  }));
});
