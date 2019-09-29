import {Injectable} from '@angular/core';
import {Theme} from '../model/theme.enum';
import {Subject} from 'rxjs';
import {VariantService} from '../../util/services/variant.service';
import {Variant} from '../../util/model/variant.enum';

/**
 * Handles current theme
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  /** Current theme */
  theme: Theme = Theme.BLUE;
  /** Subject that publishes theme */
  themeSubject = new Subject<Theme>();

  /**
   * Constructor
   */
  constructor() {
    switch (VariantService.getVariant()) {
      case Variant.SCIDDLE: {
        this.theme = Theme.BLUE;
        break;
      }
      case Variant.S4F: {
        this.theme = Theme.FUTURE;
        break;
      }
    }
  }

  /**
   * Switches theme
   * @param theme new theme
   */
  switchTheme(theme: Theme) {
    this.themeSubject.next(theme);
  }
}
