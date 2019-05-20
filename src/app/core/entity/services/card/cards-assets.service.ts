import {Injectable} from '@angular/core';
import mockCards from '../../../../../assets/cards/cards.json';
import {Card} from '../../model/card/card.model';

@Injectable({
  providedIn: 'root'
})
export class CardsAssetsService {

  /**
   * Returns cards from assets
   */
  static getAssetsCards(): Card[] {
    return mockCards;
  }
}
