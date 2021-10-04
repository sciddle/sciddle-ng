import {TestBed} from '@angular/core/testing';

import {UiImports} from '../ui.imports';
import {UiProviders} from '../ui.providers';
import {MaterialColorService} from './material-color.service';

describe('MaterialColorService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [],
    imports: [UiImports],
    providers: [UiProviders],
  }));

  it('should be created', () => {
    const service: MaterialColorService = TestBed.get(MaterialColorService);
    expect(service).toBeTruthy();
  });
});
