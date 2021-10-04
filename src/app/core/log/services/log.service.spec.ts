import {TestBed} from '@angular/core/testing';

import {LogImports} from '../log.imports';
import {LogProviders} from '../log.providers';
import {LogService} from './log.service';

describe('LogService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [],
    imports: [LogImports],
    providers: [LogProviders],
  }));

  it('should be created', () => {
    const service: LogService = TestBed.get(LogService);
    expect(service).toBeTruthy();
  });
});
