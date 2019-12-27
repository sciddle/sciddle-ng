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
    console.log(`++ ${threshold} ${message}`);
  }

  /**
   * Logs message
   * @param threshold threshold
   * @param message message
   * @param color color
   */
  static logWithColor(threshold: Threshold, message: string, color: string) {
    console.log(`%c++ ${threshold} ${message}`, `color: ${color}`);
  }

  /**
   * Logs message with threshold TRACE
   * @param message message
   */
  static trace(message: string) {
    LogService.logWithColor(Threshold.TRACE, message, 'grey');
  }

  /**
   * Logs message with threshold TRACE
   * @param message message
   */
  static traceSnack(message: string) {
    console.log(`%c++ ${message}`, 'color: blue');
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
    LogService.logWithColor(Threshold.WARN, message, 'orange');
  }

  /**
   * Logs message with threshold FATAL
   * @param message message
   */
  static fatal(message: string) {
    LogService.logWithColor(Threshold.WARN, message, 'red');
  }
}
