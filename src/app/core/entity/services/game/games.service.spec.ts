import {TestBed} from '@angular/core/testing';

import {GamesService} from './games.service';
import {STACK_PERSISTENCE_POUCHDB} from '../../entity.module';

describe('GamesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [[{provide: STACK_PERSISTENCE_POUCHDB}], GamesService]
  }));

  it('should be created', () => {
    const service: GamesService = TestBed.get(GamesService);
    expect(service).toBeTruthy();
  });
});
