import {MultiplayerGameDialogComponent} from './components/dialogs/multiplayer-game-dialog/multiplayer-game-dialog.component';
// tslint:disable-next-line:max-line-length
import {DifficultySelectionFragmentComponent} from './components/fragments/difficulty-selection-fragment/difficulty-selection-fragment.component';
import {GamesToolbarComponent} from './components/toolbars/games-toolbar/games-toolbar.component';
import {GamesComponent} from './pages/games/games.component';

/**
 * Declarations of games module
 */
export const GamesDeclarations = [
  // Pages
  GamesComponent,
  // Toolbars
  GamesToolbarComponent,
  // Dialogs
  MultiplayerGameDialogComponent,
  // Fragments
  DifficultySelectionFragmentComponent,
];
