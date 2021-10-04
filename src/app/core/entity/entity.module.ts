import {NgModule} from '@angular/core';
import {EntityImports} from './entity.imports';
import {EntityProviders} from './entity.providers';
import {_STACK_PERSISTENCE_POUCHDB} from './entity.tokens';

/** Injection token for stack persistence PouchDB */
export let STACK_PERSISTENCE_POUCHDB = _STACK_PERSISTENCE_POUCHDB;

@NgModule({
  imports: [EntityImports],
  declarations: [],
  providers: [EntityProviders],
})
/**
 * Contains services related to entities
 */
export class EntityModule {
}
