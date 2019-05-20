import {Inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Stack} from '../../../core/entity/model/stack/stack.model';
import {StacksPersistenceService} from '../../../core/entity/services/stack/persistence/stacks-persistence.interface';
import {STACK_PERSISTENCE_POUCHDB} from '../../../core/entity/entity.module';

/**
 * Resolves stack by ID
 */
@Injectable()
export class StackResolver implements Resolve<Stack> {

  /**
   * Constructor
   * @param router router
   * @param stacksPersistenceService stacks persistence service
   */
  constructor(private router: Router,
              @Inject(STACK_PERSISTENCE_POUCHDB) private stacksPersistenceService: StacksPersistenceService) {
  }

  /**
   * Resolves parameters
   * @param route route
   * @param state state
   */
  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.stacksPersistenceService.stacks.get(route.params.id);
  }
}
