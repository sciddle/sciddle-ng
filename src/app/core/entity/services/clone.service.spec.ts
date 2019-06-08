import {inject, TestBed} from '@angular/core/testing';

import {CloneService} from './clone.service';
import {EntityImports} from '../entity.imports';
import {EntityProviders} from '../entity.providers';
import {STACK_PERSISTENCE_POUCHDB} from '../entity.module';

describe('CloneService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [],
    imports: [EntityImports],
    providers: [EntityProviders, {provide: STACK_PERSISTENCE_POUCHDB}]
  }));

  it('should be created', inject([CloneService], (service: CloneService) => {
    expect(service).toBeTruthy();
  }));
});
