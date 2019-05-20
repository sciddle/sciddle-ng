import {InjectionToken, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StacksPersistenceService} from './services/stack/persistence/stacks-persistence.interface';
import {CardsService} from './services/card/cards.service';
import {CardsAssetsService} from './services/card/cards-assets.service';
import {StacksService} from './services/stack/stacks.service';
import {StacksPouchdbService} from './services/stack/persistence/stacks-pouchdb.service';

/** Injection token for stack persistence PouchDB */
export let STACK_PERSISTENCE_POUCHDB = new InjectionToken<StacksPersistenceService>('app.stack-persistence-pouchdb');

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    CardsService,
    CardsAssetsService,
    StacksService,
    {provide: STACK_PERSISTENCE_POUCHDB, useClass: StacksPouchdbService},
  ]
})
/**
 * Contains services related to entities
 */
export class EntityModule {
}
