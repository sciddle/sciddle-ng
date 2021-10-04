import {Subject} from 'rxjs';
import {Stack} from '../../../model/stack/stack.model';

/**
 * Interface containing stacks persistence methods
 */
// tslint:disable-next-line:interface-name
export interface StacksPersistenceService {

  /** Map of all stacks */
  stacks: Map<string, Stack>;
  /** Subject that publishes stacks */
  stacksSubject: Subject<Stack[]>;

  /** Stack in focus */
  stack: Stack;
  /** Subject that publishes stack */
  stackSubject: Subject<Stack>;

  /** Subject that publishes database errors */
  databaseErrorSubject: Subject<string>;

  //
  // Cancel
  //

  /**
   * Cancels subscription
   */
  cancelSubscription();

  //
  // Read
  //

  /**
   * Finds all stacks
   */
  findStacks();

  /**
   * Finds stack by a given ID
   * @param id ID of filter by
   */
  findStackByID(id: string);

  //
  // Create
  //

  /**
   * Creates a new stack
   * @param stack stack to be created
   */
  createStack(stack: Stack): Promise<any>;

  /**
   * Creates new stacks
   * @param stacks stacks to be created
   */
  createStacks(stacks: Stack[]): Promise<any>;

  //
  // Update
  //

  /**
   * Updates an existing stack
   * @param stack stack to be updated
   */
  updateStack(stack: Stack): Promise<Stack>;

  /**
   * Updates an existing stack
   * @param stack stack to be updated
   */
  updateStackWithoutNotification(stack: Stack): Promise<Stack>;

  /**
   * Updates existing stacks
   * @param stacks stacks to be updated
   */
  updateStacks(stacks: Stack[]): Promise<any>;

  //
  // Delete
  //

  /**
   * Deletes a stack
   * @param stack stack to be deleted
   */
  deleteStack(stack: Stack): Promise<any>;

  /**
   * Deletes an array of stacks
   * @param stacks stacks
   */
  deleteStacks(stacks: Stack[]): Promise<any>;

  //
  // Others
  //

  /**
   * Uploads a stack
   * @param stack stack
   */
  uploadStack(stack: Stack);

  /**
   * Clears all stacks
   */
  clearStacks();

  /**
   * Informs subscribers that something has changed
   */
  notifyMultipleStacks();

  /**
   * Informs subscribers that something has changed
   */
  notifySingleStack();

  /**
   * Notifies subscribers that a database error occurs
   * @param error error
   */
  notifyDatabaseError(error: any);
}
