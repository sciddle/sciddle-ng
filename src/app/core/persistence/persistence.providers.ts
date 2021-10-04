import {PouchDBSettingsService} from './services/pouchdb-settings.service';
import {PouchDBService} from './services/pouchdb.service';

/** Providers for persistence module */
export const PersistenceProviders = [
  PouchDBService,
  PouchDBSettingsService,
];
