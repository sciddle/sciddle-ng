import {CardsService} from './services/card/cards.service';
import {StacksService} from './services/stack/stacks.service';
import {StacksPouchdbService} from './services/stack/persistence/stacks-pouchdb.service';
import {_STACK_PERSISTENCE_POUCHDB} from './entity.tokens';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

/** Imports of entity module */
export const EntityImports = [
  CommonModule,
  HttpClientModule,
];
