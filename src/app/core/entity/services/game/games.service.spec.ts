import {TestBed} from '@angular/core/testing';
import {EntityImports} from '../../entity.imports';
import {STACK_PERSISTENCE_POUCHDB} from '../../entity.module';
import {EntityProviders} from '../../entity.providers';
import {GamesService} from './games.service';

describe('GamesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [],
    imports: [EntityImports],
    providers: [EntityProviders, {provide: STACK_PERSISTENCE_POUCHDB}],
  }));

  it('should be created', () => {
    const service: GamesService = TestBed.get(GamesService);
    expect(service).toBeTruthy();
  });
});
