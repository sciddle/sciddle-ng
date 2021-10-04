import {TestBed} from '@angular/core/testing';

import {UiImports} from '../ui.imports';
import {UiProviders} from '../ui.providers';
import {MaterialIconService} from './material-icon.service';

describe('MaterialIconService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [],
    imports: [UiImports],
    providers: [UiProviders],
  }));

  it('should be created', () => {
    const service: MaterialIconService = TestBed.get(MaterialIconService);
    expect(service).toBeTruthy();
  });
});
