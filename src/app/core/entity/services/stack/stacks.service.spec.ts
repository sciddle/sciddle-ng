import {inject, TestBed} from '@angular/core/testing';

import {EntityImports} from '../../entity.imports';
import {STACK_PERSISTENCE_POUCHDB} from '../../entity.module';
import {EntityProviders} from '../../entity.providers';
import {StacksService} from './stacks.service';

describe('StacksPersistenceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [],
    imports: [EntityImports],
    providers: [EntityProviders, {provide: STACK_PERSISTENCE_POUCHDB}],
  }));

  it('should ...', inject([StacksService], (service: StacksService) => {
    expect(service).toBeTruthy();
  }));
});
