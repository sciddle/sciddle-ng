import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

/**
 * Displays a stop watch counting down
 */
@Component({
  selector: 'app-stop-watch',
  templateUrl: './stop-watch.component.html',
  styleUrls: ['./stop-watch.component.scss'],
})
export class StopWatchComponent implements OnInit {

  /** Duration in minutes */
  @Input() public duration = 0;
  /** Start time */
  @Input() public startTime: Date;
  /** Event emitter indicating time left in seconds */
  @Output() public timeLeftEmitter = new EventEmitter<number>();

  /** Seconds left */
  public secondsLeft: number;
  /** String representing left-over time */
  public timeLeft = StopWatchComponent.getMinutesString(0);

  //
  //  Helpers
  //

  /**
   * Returns the difference of two dates in seconds
   * @param one first date
   * @param two second date
   */
  public static diffInSeconds(one: Date, two: Date): number {
    return Math.floor(StopWatchComponent.getDiffInMilliseconds(one, two) / 1000);
  }

  /**
   * Returns the difference of two dates in milliseconds
   * @param one first date
   * @param two second date
   */
  public static getDiffInMilliseconds(one: Date, two: Date) {
    return new Date(one).getTime() - new Date(two).getTime();
  }

  /**
   * Returns a string representing minutes (might be negative)
   * @param seconds seconds
   */
  public static getMinutesString(seconds: number): string {
    const negative = seconds < 0;
    const diffMin = Math.abs(Math.floor(seconds / 60));
    const diffSec = Math.abs(Math.floor(seconds % 60));

    return `${negative ? '-' : ''}
    ${StopWatchComponent.getTwoCharacterString(diffMin)}:${StopWatchComponent.getTwoCharacterString(diffSec)}`;
  }

  /**
   * Returns a string that has at least two characters (used for displaying hours and minutes)
   * @param value numeric value
   * @return two-character string
   */
  public static getTwoCharacterString(value: number): string {
    return (value < 10) ?
      `0${value}`
      : value.toString();
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  public ngOnInit() {
    // Initially calculate time left
    this.calculateTimeLeft();

    // Check if time is active
    if (this.isTimerActive()) {
      const refreshIntervalID = setInterval(() => {
        if (this.isTimerActive()) {
          this.calculateTimeLeft();
          this.timeLeftEmitter.emit(this.secondsLeft);
        } else {
          // Stop timer if time is over
          clearInterval(refreshIntervalID);
          this.invalidateTimer();
          this.timeLeftEmitter.emit(this.secondsLeft);
        }
      }, 1000);
    } else {
      this.invalidateTimer();
    }
  }

  //
  // Helpers
  //

  /**
   * Deactivates timer
   */
  private invalidateTimer() {
    this.timeLeft = StopWatchComponent.getMinutesString(0);
  }

  /**
   * Calculates the amount of seconds left on this timer
   */
  private calculateTimeLeft() {
    const desiredDurationInSeconds = this.duration * 60;
    const actualDurationInSeconds = StopWatchComponent.diffInSeconds(new Date(), this.startTime);

    this.secondsLeft = desiredDurationInSeconds - actualDurationInSeconds;
    this.timeLeft = StopWatchComponent.getMinutesString(this.secondsLeft);
  }

  /**
   * Determines whether the time is active
   */
  private isTimerActive(): boolean {
    return this.secondsLeft === undefined || this.secondsLeft > 0;
  }
}
