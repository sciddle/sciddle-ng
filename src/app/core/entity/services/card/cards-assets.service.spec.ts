import {TestBed} from '@angular/core/testing';

import {CardsAssetsService} from './cards-assets.service';

describe('CardsAssetsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CardsAssetsService = TestBed.get(CardsAssetsService);
    expect(service).toBeTruthy();
  });
});
