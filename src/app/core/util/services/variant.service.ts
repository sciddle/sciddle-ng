import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {Variant} from '../model/variant.enum';

/**
 * Service handling variants
 */
@Injectable({
  providedIn: 'root'
})
export class VariantService {

  /**
   * Determines variant
   */
  static getVariant(): Variant {
    switch (environment.VARIANT) {
      case 'Sciddle': {
        return Variant.SCIDDLE;
      }
      case 'S4F': {
        return Variant.S4F;
      }
    }
  }
}
