import {TestBed} from '@angular/core/testing';

import {LogService} from './log.service';
import {LogProviders} from '../log.providers';
import {LogImports} from '../log.imports';

describe('LogService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [],
    imports: [LogImports],
    providers: [LogProviders]
  }));

  it('should be created', () => {
    const service: LogService = TestBed.get(LogService);
    expect(service).toBeTruthy();
  });
});
