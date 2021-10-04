import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {LogService} from '../../log/services/log.service';

/**
 * Handles snack bars
 */
@Injectable({
  providedIn: 'root',
})
export class SnackbarService {

  /** Subject that publishes messages to be shown in a snack bar */
  public messageSubject = new Subject<string[]>();

  /**
   * Shows snackbar with a given message
   * @param message message
   */
  public showSnackbar(message: string) {
    LogService.traceSnack(`${message}`);
    this.messageSubject.next([message, '', null]);
  }

  /**
   * Shows snackbar with a given message, an action name and an action which is triggered when action is clicked
   * @param message message
   * @param actionName action name
   * @param action action
   */
  public showSnackbarWithAction(message: string, actionName: string, action: any) {
    this.messageSubject.next([message, actionName, action]);
  }
}
