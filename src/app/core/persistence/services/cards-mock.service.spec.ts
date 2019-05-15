import { TestBed } from '@angular/core/testing';

import { CardsMockService } from './cards-mock.service';

describe('CardsMockService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CardsMockService = TestBed.get(CardsMockService);
    expect(service).toBeTruthy();
  });
});
