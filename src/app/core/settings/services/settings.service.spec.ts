import {inject, TestBed} from '@angular/core/testing';

import {SettingsImports} from '../settings.imports';
import {SettingsProviders} from '../settings.providers';
import {SettingsService} from './settings.service';

describe('SettingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SettingsImports],
      providers: [SettingsProviders],
    });
  });

  it('should be created', inject([SettingsService], (service: SettingsService) => {
    expect(service).toBeTruthy();
  }));
});
