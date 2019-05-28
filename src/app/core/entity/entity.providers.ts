import {CardsService} from './services/card/cards.service';
import {CardsAssetsService} from './services/card/cards-assets.service';
import {StacksService} from './services/stack/stacks.service';
import {StacksPouchdbService} from './services/stack/persistence/stacks-pouchdb.service';
import {STACK_PERSISTENCE_POUCHDB} from './entity.module';

/** Providers of entity component */
export const EntityProviders = [
  CardsService,
  CardsAssetsService,
  StacksService,
  {provide: STACK_PERSISTENCE_POUCHDB, useClass: StacksPouchdbService},
];
