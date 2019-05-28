import {InjectionToken, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EntityProviders} from './entity.providers';
import {StacksPersistenceService} from './services/stack/persistence/stacks-persistence.interface';

/** Injection token for stack persistence PouchDB */
export let STACK_PERSISTENCE_POUCHDB = new InjectionToken<StacksPersistenceService>('app.stack-persistence-pouchdb');

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [EntityProviders]
})
/**
 * Contains services related to entities
 */
export class EntityModule {
}
