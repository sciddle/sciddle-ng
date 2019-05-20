import {Injectable, isDevMode} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {StacksPersistenceService} from './stacks-persistence.interface';
import {Stack} from '../../../model/stack/stack.model';
import {PouchDBService} from '../../../../persistence/services/pouchdb.service';
import {EntityType} from '../../../model/entity-type.enum';

/**
 * Handles stack persistence via PouchDB
 */
@Injectable({
  providedIn: 'root'
})
export class StacksPouchdbService implements StacksPersistenceService {

  /** Map of all stacks */
  stacks = new Map<string, Stack>();
  /** Subject that publishes stacks */
  stacksSubject = new Subject<Stack[]>();

  /** Stack in focus */
  stack: Stack;
  /** Subject that publishes stack */
  stackSubject = new Subject<Stack>();

  /**
   * Constructor
   * @param pouchDBService PouchDB service
   */
  constructor(private pouchDBService: PouchDBService) {
    this.initializeStackSubscription();
  }

  //
  // Initialization
  //

  /**
   * Initializes stack subscription
   */
  private initializeStackSubscription() {
    this.stacksSubject.subscribe((value) => {
      (value as Stack[]).forEach(stack => {
          this.stacks.set(stack.id, stack);
        }
      );
    });
  }

  //
  // Cancel
  //

  /**
   * Cancels subscription
   */
  public cancelSubscription() {
  }

  //
  // Read
  //

  /**
   * Finds all stacks
   */
  public findStacks() {
    const index = {fields: ['entityType']};
    const options = {
      selector: {
        $and: [
          {entityType: {$eq: EntityType.STACK}}
        ]
      },
    };

    this.clearStacks();
    this.findStacksInternal(index, options);
  }

  /**
   * Finds stack by a given ID
   * @param id ID of filter by
   */
  public findStackByID(id: string) {
    const index = {fields: ['entityType', 'id', 'creationDate']};
    const options = {
      selector: {
        $and: [
          {entityType: {$eq: EntityType.STACK}},
          {id: {$eq: id}}
        ]
      },
    };

    this.findStackInternal(index, options);
  }

  //
  // Create
  //

  /**
   * Creates a new stack
   * @param stack stack to be created
   */
  public createStack(stack: Stack): Promise<any> {
    return new Promise((resolve, reject) => {

      if (stack == null) {
        reject();
      }

      // Create stack
      return this.pouchDBService.upsert(stack.id, stack).then(() => {
        this.stacks.set(stack.id, stack);
        this.notifyMultipleStacks();
        resolve();
      });
    });
  }

  /**
   * Creates new stacks
   * @param stacks stacks to be created
   */
  public createStacks(stacks: Stack[]): Promise<any> {
    return undefined;
  }

  //
  // Update
  //

  /**
   * Updates an existing stack
   * @param stack stack to be updated
   */
  public updateStack(stack: Stack): Promise<any> {
    return new Promise((resolve, reject) => {
      if (stack == null) {
        reject();
      }

      // Update stack
      return this.pouchDBService.upsert(stack.id, stack).then(() => {
        this.stacks.set(stack.id, stack);
        this.notifyMultipleStacks();
        this.notifySingleStack();
        resolve();
      });
    });
  }

  /**
   * Updates existing stacks
   * @param stacks stacks to be updated
   */
  public updateStacks(stacks: Stack[]): Promise<any> {
    return undefined;
  }

  //
  // Delete
  //

  /**
   * Deletes a stack
   * @param stack stack to be deleted
   */
  public deleteStack(stack: Stack): Promise<any> {
    return new Promise((resolve, reject) => {
      if (stack == null) {
        reject();
      }

      return this.pouchDBService.remove(stack.id, stack).then(() => {
        this.stacks.delete(stack.id);
        this.notifyMultipleStacks();
        resolve();
      });
    });
  }

  /**
   * Deletes an array of stacks
   * @param stacks stacks
   */
  deleteStacks(stacks: Stack[]): Promise<any> {
    return undefined;
  }

  //
  // Others
  //

  /**
   * Uploads a stack
   * @param stack stack
   */
  public uploadStack(stack: Stack) {
    stack['_rev'] = null;
    stack['_id'] = null;

    this.pouchDBService.upsert(stack.id, stack);
  }

  /**
   * Clears cards
   */
  public clearStacks() {
    this.stacks.clear();
  }

  /**
   * Informs subscribers that something has changed
   */
  public notifyMultipleStacks() {
    this.stacksSubject.next(Array.from(this.stacks.values()).sort((t1, t2) => {
      return 1;
    }));
  }

  /**
   * Informs subscribers that something has changed
   */
  public notifySingleStack() {
    this.stackSubject.next(this.stack);
  }

  //
  // Internal
  //

  /**
   * Index cards and queries them afterwards
   * @param index index to be used
   * @param options query options
   */
  private findStacksInternal(index: any, options: any) {
    this.pouchDBService.find(index, options).then(result => {
        result['docs'].forEach(element => {
          const stack = element as Stack;
          this.stacks.set(stack.id, stack);
        });
        this.notifyMultipleStacks();
      }, error => {
        if (isDevMode()) {
          console.error(error);
        }
      }
    );
  }

  /**
   * Index stacks and queries them afterwards
   * @param index index to be used
   * @param options query options
   */
  private findStackInternal(index: any, options: any) {
    this.pouchDBService.find(index, options).then(result => {
        result['docs'].forEach(element => {
          this.stack = element as Stack;
        });
        this.notifySingleStack();
      }, error => {
        if (isDevMode()) {
          console.error(error);
        }
      }
    );
  }
}