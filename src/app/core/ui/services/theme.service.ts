import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Theme} from '../model/theme.enum';

/**
 * Handles current theme
 */
@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  /** Current theme */
  public theme: Theme = Theme.BLUE;
  /** Subject that publishes theme */
  public themeSubject = new Subject<Theme>();

  /**
   * Switches theme
   * @param theme new theme
   */
  public switchTheme(theme: Theme) {
    this.themeSubject.next(theme);
  }
}
