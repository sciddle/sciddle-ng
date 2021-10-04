import {WikipediaDialogComponent} from './components/dialogs/wikpedia-dialog/wikipedia-dialog.component';
import {CardFragmentComponent} from './components/fragments/card-fragment/card-fragment.component';
// tslint:disable-next-line:max-line-length
import {DifficultySelectionFragmentComponent} from './components/fragments/difficulty-selection-fragment/difficulty-selection-fragment.component';
import {GameEvaluationFragmentComponent} from './components/fragments/game-evaluation-fragment/game-evaluation-fragment.component';
import {ScoreOverviewFragmentComponent} from './components/fragments/score-overview-fragment/score-overview-fragment.component';
import {TeamInformationFragmentComponent} from './components/fragments/team-information-fragment/team-information-fragment.component';
import {TeamSelectionFragmentComponent} from './components/fragments/team-selection-fragment/team-selection-fragment.component';
import {CardsToolbarComponent} from './components/toolbars/cards-toolbar/cards-toolbar.component';
import {CardsComponent} from './pages/cards/cards.component';

/**
 * Declarations of cards module
 */
export const CardsDeclarations = [
  // Pages
  CardsComponent,
  // Toolbars
  CardsToolbarComponent,
  // Dialogs
  WikipediaDialogComponent,
  // Fragments
  CardFragmentComponent,
  DifficultySelectionFragmentComponent,
  GameEvaluationFragmentComponent,
  ScoreOverviewFragmentComponent,
  TeamInformationFragmentComponent,
  TeamSelectionFragmentComponent,
];
