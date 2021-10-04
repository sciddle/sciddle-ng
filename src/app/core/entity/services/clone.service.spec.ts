import {inject, TestBed} from '@angular/core/testing';

import {EntityImports} from '../entity.imports';
import {STACK_PERSISTENCE_POUCHDB} from '../entity.module';
import {EntityProviders} from '../entity.providers';
import {CloneService} from './clone.service';

describe('CloneService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [],
    imports: [EntityImports],
    providers: [EntityProviders, {provide: STACK_PERSISTENCE_POUCHDB}],
  }));

  it('should be created', inject([CloneService], (service: CloneService) => {
    expect(service).toBeTruthy();
  }));
});
