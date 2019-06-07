import {CardsService} from './services/card/cards.service';
import {StacksService} from './services/stack/stacks.service';
import {StacksPouchdbService} from './services/stack/persistence/stacks-pouchdb.service';
import {_STACK_PERSISTENCE_POUCHDB} from './entity.tokens';

/** Providers of entity component */
export const EntityProviders = [
  CardsService,
  StacksService,
  {provide: _STACK_PERSISTENCE_POUCHDB, useClass: StacksPouchdbService},
];
