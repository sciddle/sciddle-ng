import {Inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {GamesService} from '../core/entity/services/game/games.service';
import {STACK_PERSISTENCE_POUCHDB} from '../core/entity/entity.module';
import {StacksPersistenceService} from '../core/entity/services/stack/persistence/stacks-persistence.interface';
import {Stack} from '../core/entity/model/stack/stack.model';
import {ROUTE_CARDS, ROUTE_GAMES, ROUTE_STACKS} from '../app.routes';
import {environment} from '../../environments/environment';

/**
 * Checks if it is necessary to show game page
 */
@Injectable({
  providedIn: 'root',
})
export class GameGuard implements CanActivate {

  /**
   * Constructor
   * @param stacksPersistenceService stacks persistence service
   * @param router router
   */
  constructor(@Inject(STACK_PERSISTENCE_POUCHDB) private stacksPersistenceService: StacksPersistenceService,
              private router: Router) {
  }

  /**
   * Checks if the guarded route can be activated
   * @param next activated toute
   * @param state router state
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve) => {

      const variant = environment.VARIANT;

      switch (variant) {
        case 'Sciddle': {
          resolve(true);
          break;
        }
        case 'S4F': {
          this.router.navigate([`${ROUTE_GAMES}`]).then();
          resolve(false);
          break;
        }
      }
    });
  }
}
