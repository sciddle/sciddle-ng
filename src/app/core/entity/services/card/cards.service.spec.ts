import { TestBed } from '@angular/core/testing';

import { CardsService } from './cards.service';
import {EntityImports} from '../../entity.imports';
import {EntityProviders} from '../../entity.providers';
import {STACK_PERSISTENCE_POUCHDB} from '../../entity.module';

describe('CardsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [],
    imports: [EntityImports],
    providers: [EntityProviders, {provide: STACK_PERSISTENCE_POUCHDB}]
  }));

  it('should be created', () => {
    const service: CardsService = TestBed.get(CardsService);
    expect(service).toBeTruthy();
  });
});
