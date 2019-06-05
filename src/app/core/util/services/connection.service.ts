import {Injectable} from '@angular/core';

/**
 * Checks internet connection
 */
@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  /**
   * Determines if client is online
   */
  static isOnline(): boolean {
    return navigator.onLine;
  }
}
