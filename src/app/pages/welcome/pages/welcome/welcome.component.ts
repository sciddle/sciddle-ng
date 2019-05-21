import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SnackbarService} from '../../../../core/ui/services/snackbar.service';

/**
 * Displays welcome page
 */
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  /**
   * Constructor
   * @param router router
   * @param snackbarService snackbar service
   */
  constructor(private router: Router,
              private snackbarService: SnackbarService) {
  }

  ngOnInit() {
  }

  //
  // Actions
  //

  /**
   * Handles click on single-user button
   */
  onSinglePlayerClicked() {
    this.router.navigate([`/cards/0`]).then(() => {
    });
  }

  /**
   * Handles click on multiple-user button
   */
  onMultiplePlayerClicked() {

  }
}
