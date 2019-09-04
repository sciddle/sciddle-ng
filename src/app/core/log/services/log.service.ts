import {Injectable} from '@angular/core';
import {Threshold} from '../model/threshold.enum';

/**
 * Handles logging
 */
@Injectable({
  providedIn: 'root'
})
export class LogService {

  /**
   * Logs message
   * @param threshold threshold
   * @param message message
   */
  static log(threshold: Threshold, message: string) {
    console.log(`${threshold} ${message}`);
  }

  /**
   * Logs message with threshold TRACE
   * @param message message
   */
  static trace(message: string) {
    console.log(`%c++ ${message}`, 'color: grey');
  }

  /**
   * Logs message with threshold DEBUG
   * @param message message
   */
  static debug(message: string) {
    LogService.log(Threshold.DEBUG, message);
  }

  /**
   * Logs message with threshold INFO
   * @param message message
   */
  static info(message: string) {
    LogService.log(Threshold.INFO, message);
  }

  /**
   * Logs message with threshold WARN
   * @param message message
   */
  static warn(message: string) {
    LogService.log(Threshold.WARN, message);
  }

  /**
   * Logs message with threshold FATAL
   * @param message message
   */
  static fatal(message: string) {
    console.error(`${Threshold.FATAL} ${message}`);
  }
}
