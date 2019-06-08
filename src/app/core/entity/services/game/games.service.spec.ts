import {TestBed} from '@angular/core/testing';
import {GamesService} from './games.service';
import {STACK_PERSISTENCE_POUCHDB} from '../../entity.module';
import {EntityImports} from '../../entity.imports';
import {EntityProviders} from '../../entity.providers';

describe('GamesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [],
    imports: [EntityImports],
    providers: [EntityProviders, {provide: STACK_PERSISTENCE_POUCHDB}]
  }));

  it('should be created', () => {
    const service: GamesService = TestBed.get(GamesService);
    expect(service).toBeTruthy();
  });
});
