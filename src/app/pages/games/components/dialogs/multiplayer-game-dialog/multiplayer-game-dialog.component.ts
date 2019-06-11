import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSliderChange} from '@angular/material';
import {environment} from '../../../../../../environments/environment';

/**
 * Displays multiplayer dialog
 */
@Component({
  selector: 'app-multiplayer-game-dialog',
  templateUrl: './multiplayer-game-dialog.component.html',
  styleUrls: ['./multiplayer-game-dialog.component.scss']
})
export class MultiplayerGameDialogComponent implements OnInit {

  /** Dialog title */
  dialogTitle = '';

  /** Selected time limit mode */
  public useTimeLimit = false;
  /** Selected team count */
  public teamCount = -1;
  /** Selected difficulty easy */
  public difficultyEasy = false;
  /** Selected difficulty medium */
  public difficultyMedium = false;
  /** Selected difficulty hard */
  public difficultyHard = false;
  /** Selected card count */
  public cardCount = 0;

  /** Minimum card count */
  public minCardCount = environment.MIN_CARDS;
  /** Maximum card count */
  public maxCardCount;

  /**
   * Constructor
   * @param dialogRef dialog reference
   * @param data dialog data
   */
  constructor(public dialogRef: MatDialogRef<MultiplayerGameDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  //
  // Lifecycle hooks
  //

  /**
   * Handles on-init lifecycle phase
   */
  ngOnInit() {
    this.initializeData();
  }

  //
  // Initialization
  //

  /**
   * Initializes data
   */
  private initializeData() {
    this.dialogTitle = this.data.title;
    this.cardCount = this.data.cardCount;
    this.minCardCount = this.data.minCardCount;
    this.maxCardCount = this.data.maxCardCount;
  }

  //
  // Actions
  //

  /**
   * Toggles usage of time limit
   */
  onTimeLimitToggled() {
    this.useTimeLimit = !this.useTimeLimit;
  }

  /**
   * Handles selection of team count
   * @param teamCount number of teams
   */
  onTeamCountSelected(teamCount: number) {
    this.teamCount = teamCount;
  }

  /**
   * Handles difficulty selection
   * @param event event
   */
  onDifficultySelected(event: { difficulty: number, selected: boolean }) {
    switch (event.difficulty) {
      case 1: {
        this.difficultyEasy = event.selected;
        break;
      }
      case 2: {
        this.difficultyMedium = event.selected;
        break;
      }
      case 3: {
        this.difficultyHard = event.selected;
        break;
      }
    }
  }

  /**
   * Handles card count change
   * @param event event
   */
  onCardCountChanged(event: MatSliderChange) {
    this.cardCount = event.value;
  }

  //
  // Button actions
  //

  /**
   * Handles click on confirm button
   */
  startGame() {
    this.dialogRef.close(
      {
        teamCount: this.teamCount,
        useTimeLimit: this.useTimeLimit,
        difficultyEasy: this.difficultyEasy,
        difficultyMedium: this.difficultyMedium,
        difficultyHard: this.difficultyHard,
        cardCount: this.cardCount
      }
    );
  }

  //
  // Helpers
  //

  /**
   * Generates an array of a given number of elements
   * @param n number of elements
   */
  arrayOne(n: number): any[] {
    return Array(n);
  }
}
