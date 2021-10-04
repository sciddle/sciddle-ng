import {InjectionToken} from '@angular/core';
import {StacksPersistenceService} from './services/stack/persistence/stacks-persistence.interface';

/** Injection token for stack persistence PouchDB */
export let _STACK_PERSISTENCE_POUCHDB = new InjectionToken<StacksPersistenceService>('app.stack-persistence-pouchdb');
