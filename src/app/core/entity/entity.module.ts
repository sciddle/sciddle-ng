import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EntityProviders} from './entity.providers';
import {_STACK_PERSISTENCE_POUCHDB} from './entity.tokens';
import {EntityImports} from './entity.imports';


/** Injection token for stack persistence PouchDB */
export let STACK_PERSISTENCE_POUCHDB = _STACK_PERSISTENCE_POUCHDB;

@NgModule({
  imports: [EntityImports],
  declarations: [],
  providers: [EntityProviders]
})
/**
 * Contains services related to entities
 */
export class EntityModule {
}
