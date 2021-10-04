import {TestBed} from '@angular/core/testing';

import {NotificationImports} from '../notification.imports';
import {NotificationProviders} from '../notification.providers';
import {NotificationService} from './notification.service';

describe('NotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [],
    imports: [NotificationImports],
    providers: [NotificationProviders],
  }));

  it('should be created', () => {
    const service: NotificationService = TestBed.get(NotificationService);
    expect(service).toBeTruthy();
  });
});
